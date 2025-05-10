import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Consulta, Medico } from './consultas-entity';
import { ApiTags } from '@nestjs/swagger';


@ApiTags('consultas')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  
  @Post('medico')
  async createMedico(@Body() body: Medico) {
    return await this.appService.createMedico(body);
  }

  @Post('consulta')
  async createConsulta(@Body() body: Consulta) {
    return await this.appService.createConsulta(body);
  }

  @Get('consulta/:id')
  async getConsulta(@Param('id') id: number) {
    return await this.appService.getConsulta(id);
  }
  @Get('medico/:id')
  async getMedico(@Param('id') id: number) {
    return await this.appService.getMedico(id);
  }
  @Get('consultas/paciente/:id')
  getConsultasPorPaciente(@Param('id') id: number) {
    return this.appService.getConsultasPorPaciente(id);
  }

  @Get('consultas/medico/:id')
  getConsultasPorMedico(@Param('id') id: number) {
    return this.appService.getConsultasPorMedico(id);
  }

}
