import { Injectable, OnModuleInit, NotFoundException, BadRequestException, InternalServerErrorException} from '@nestjs/common';
import {Pool} from 'pg';
import { ConfigService } from '@nestjs/config';
import { Consulta, Medico } from './consultas-entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly pool: Pool;
  constructor(private readonly configService: ConfigService, private readonly httpService: HttpService) {
    this.pool = new Pool({
      user: this.configService.get<string>('PG_USER'),
      host: this.configService.get<string>('PG_HOST'),
      database: this.configService.get<string>('PG_DATABASE'),
      password: this.configService.get<string>('PG_PASSWORD'),
      port: parseInt(this.configService.get<string>('PG_PORT') ?? '5432'),
    });

  }

  async onModuleInit() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS medico (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(50) NOT NULL,
        apellido VARCHAR(50) NOT NULL,
        especialidad VARCHAR(50) NOT NULL
      );
      CREATE TABLE IF NOT EXISTS consulta (
        id SERIAL PRIMARY KEY,
        fecha DATE NOT NULL,
        descripcion VARCHAR(255) NOT NULL,
        paciente_id INTEGER NOT NULL,
        medico_id INTEGER REFERENCES medico(id)
      );
    `);
  }

  async createMedico(data: Medico) {
    const { nombre, apellido, especialidad } = data;
    const result = await this.pool.query(
      'INSERT INTO medico (nombre, apellido, especialidad) VALUES ($1, $2, $3) RETURNING *',
      [nombre, apellido, especialidad]
    );
    return result.rows[0];
  }
  async createConsulta(data: Consulta) {
    const { fecha, descripcion, pacienteId, medicoId } = data;

    try {
      const response = await firstValueFrom(
        this.httpService.get(`http://pacientes-api:5000/pacientes/${pacienteId}`)
      );

      if (!response.data) {
        throw new NotFoundException('Paciente no encontrado');
      }

    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundException('Paciente no encontrado');
      }
      console.error('Error al consultar el microservicio de pacientes:', error.message);
      throw new InternalServerErrorException('Error al consultar el servicio de pacientes');
    }

    const medicoExists = await this.pool.query('SELECT * FROM medico WHERE id = $1', [medicoId]);
    if (medicoExists.rowCount === 0) {
      throw new NotFoundException('Médico no encontrado');
    }

    try {
      const result = await this.pool.query(
        'INSERT INTO consulta (fecha, descripcion, paciente_id, medico_id) VALUES ($1, $2, $3, $4) RETURNING *',
        [fecha, descripcion, pacienteId, medicoId]
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error al insertar la consulta:', err.message);
      throw new BadRequestException('Error al registrar la consulta médica');
    }
  } 
  async getConsulta(id: number) {
    const result = await this.pool.query('SELECT * FROM consulta WHERE id = $1', [id]);
    
    if (!result.rows[0]) {
      throw new NotFoundException(`Consulta con ID ${id} no encontrada`);
    }
  
    return result.rows[0];
  }
  
  async getConsultasPorPaciente(pacienteId: number) {
    const query = `
      SELECT 
        consulta.fecha,
        consulta.descripcion,
        consulta.paciente_id,
        medico.nombre AS nombre_medico
      FROM consulta
      JOIN medico ON consulta.medico_id = medico.id
      WHERE consulta.paciente_id = $1
    `;
    const result = await this.pool.query(query, [pacienteId]);
    return result.rows;
  }


  async getConsultasPorMedico(medicoId: number) {
  const query = `
    SELECT 
      consulta.fecha,
      consulta.descripcion,
      consulta.paciente_id
    FROM consulta
    WHERE consulta.medico_id = $1
  `;
  const result = await this.pool.query(query, [medicoId]);

  const consultasConPaciente = await Promise.all(
    result.rows.map(async (consulta) => {
      try {
        const response = await firstValueFrom(
          this.httpService.get(`http://pacientes-api:5000/pacientes/${consulta.paciente_id}`)
        );
        return {
          ...consulta,
          paciente_nombre: response.data.nombre,
        };
      } catch (err) {
        return {
          ...consulta,
          paciente_nombre: 'Desconocido',
        };
      }
    })
  );

  return consultasConPaciente;
}


  async getMedico(id: number) {
    const result = await this.pool.query('SELECT * FROM medico WHERE id = $1', [id]);
    if(!result.rows[0]){
      throw new NotFoundException(`Medico con ID ${id} no encontrado`);
    }
    return result.rows[0];
  }
  async getAllMedicos() {
    const result = await this.pool.query('SELECT * FROM medico');
    return result.rows;
  }

  async getAllConsultas() {
    const result = await this.pool.query('SELECT * FROM consulta LIMIT 100');
    return result.rows;
  }


}
