import { ApiProperty } from "@nestjs/swagger";

export class Medico {
  @ApiProperty()
  nombre: string;
  @ApiProperty()
  apellido: string;
  @ApiProperty()
  especialidad: string;
}

export class Consulta {
  @ApiProperty()
  id: number;
  @ApiProperty()
  fecha: Date;
  @ApiProperty()
  descripcion: string;
  @ApiProperty  ()
  pacienteId: number;
  @ApiProperty()
  medicoId: number;
}