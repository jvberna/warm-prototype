
import { NgClass } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { TextFieldModule } from '@angular/cdk/text-field';
import { WasusiService } from 'app/core/wasusi/wasusi.service';
import Fechas from '../../../core/libs/fechas';
import { FuseAlertService, FuseAlertComponent } from '@fuse/components/alert';
import { TranslocoModule } from '@ngneat/transloco';

import { environment } from 'environments/environment.development';
import { firstValueFrom } from 'rxjs';

import { CalendarModule } from 'primeng/calendar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule} from '@angular/material/table';

import { CommonModule } from '@angular/common';

import { NgApexchartsModule} from "ng-apexcharts";



@Component({
  selector: 'app-start',
  standalone: true,
  imports: [NgApexchartsModule,CommonModule,MatTableModule,MatTabsModule, CalendarModule, MatCheckboxModule, TranslocoModule, NgClass, MatInputModule, MatDatepickerModule, MatButtonModule, TextFieldModule, ReactiveFormsModule, FormsModule, FuseAlertComponent,],
  styleUrls: ['./start.component.scss'],
  templateUrl: './start.component.html',
  encapsulation: ViewEncapsulation.None,

})

export class StartComponent implements OnInit {

  // **************** SERVICIOS
  private _wasusi = inject(WasusiService);
  private _fuseAlertService = inject(FuseAlertService)


  // ************** VARIABLES PARA EL FORMULARIO
  // Configuracion KNN
  fecha: any = new Date();
  knn: FormControl = new FormControl(environment.knnconfig.knn, [Validators.required, Validators.min(1)]);
  weekplus: FormControl = new FormControl(environment.knnconfig.weekplus, [Validators.required, Validators.min(0)]);
  weekminus: FormControl = new FormControl(environment.knnconfig.weekminus, [Validators.required, Validators.min(0)]);
  // Configuración control
  tl: FormControl = new FormControl(environment.controlconfig.tl, [Validators.required, Validators.min(0)]);
  ps: FormControl = new FormControl(environment.controlconfig.ps, [Validators.required, Validators.min(0)]);
  min: FormControl = new FormControl(environment.controlconfig.min, [Validators.required, Validators.min(0)]);
  max: FormControl = new FormControl(environment.controlconfig.max, [Validators.required, Validators.min(0)]);
  long: FormControl = new FormControl(environment.controlconfig.long, [Validators.required, Validators.min(0)]);
  // Configuración infraestructura
  wcm: FormControl = new FormControl(environment.infraestructureconfig.wcm, [Validators.required, Validators.min(0)]);
  ppc: FormControl = new FormControl(environment.infraestructureconfig.ppc, [Validators.required, Validators.min(0)]);
  constA: FormControl = new FormControl(environment.infraestructureconfig.constA, [Validators.required, Validators.min(0)]);
  constB: FormControl = new FormControl(environment.infraestructureconfig.constB, [Validators.required, Validators.min(0)]);
  constC: FormControl = new FormControl(environment.infraestructureconfig.constC, [Validators.required, Validators.min(0)]);

  //****************** MATRICES PARA LA VISUALIZACIÓN DE LAS TABLAS */
  public mPosColumns:string[]=[];
  public mPos = [];
  public mPerColumns:string[]=[];
  public mPer = [];
  public mL = [];
  public mLColumns:string[]=[];
  public mC = [];
  public mCColumns:string[]=[];
  public rows = 0;
  public op={index: -1, value:0};
  private _prediccion = [];

  //*********************** VARIABLES PARA LAS GRÁFICAS */
  public chartOptions: any; // Partial<ChartOptions>;
  title_explore = "Operation of pumps";

  ngOnInit() {
    this.loadGraphData();
  }

  selectRow(row) {
    console.log(row)
  }

  async generar() {
    // comprobamos que los campos son válidos y si no lanzamos mensaje de error
    if (!this.validarCampos()) {
      this.mostrarMensaje('ErrorCampos');
      return;
    }

    const fechaSel = this.getFecha();
    try {

      let prediction = await firstValueFrom(this._wasusi.getKNN(this.knn.value, Fechas.horanum(fechaSel), Fechas.diasemana(fechaSel), Fechas.semanaanyo(fechaSel), this.weekplus.value, this.weekminus.value, this.long.value));
      console.log(prediction);
      this._prediccion = prediction.vectorknn.slice();
      const control: any = await firstValueFrom(this._wasusi.getControl(prediction.vectorknn, this.tl.value, this.ps.value, this.max.value, this.min.value,
        this.long.value, this.wcm.value, this.ppc.value, this.constA.value, this.constB.value, this.constC.value));

      this.mPer = control.mPer;
      this.mPerColumns = control.mPerColumns;
      this.mL = control.mL;
      this.mLColumns = control.mLColumns;
      this.mC = control.mC;
      this.mCColumns = control.mCColumns;
      this.mPos = control.mPos;
      this.mPosColumns = control.mPosColumns;
      this.rows = control.rows;

      // Buscamos el mínimo de la matriz de coste
      if (this.rows>0) {
        this.op.index = 0;
        this.op.value = this.mC[0]['cost']
        for (let i=1; i<this.mC.length; i++) {
          if (this.op.value>this.mC[i]['cost']) {
            this.op.index = i;
            this.op.value = this.mC[i]['cost']
          }
        }
        console.log('Optimo:',this.op)
      } else {
        this.op.index = -1;
        this.op.value = 0;
      }


    } catch (error) {
      this.mostrarMensaje('ErrorGenerar');
      console.log(error);
    }

  }


  loadGraphData() {

    if (this.op.index>=0) {

      // Configuramos las series para cargar datos en la gráfica

      let series = [];
      let dataControl:number[]=[];
      // Construir la serie de valores de funcionamiento desde la mPer
      // Para cada elemento del vector, quitando la primera columna que es indice, creamos un data
      this.mPerColumns.slice(1).forEach(element => {
        dataControl.push(this.mPer[this.op.index][element])
      });
      series.push({
        name:"Control",
        data: dataControl
      })

      // Serie predicción
      let dataPred = [null];
      this._prediccion.forEach(element => dataPred.push(Number(element.toFixed(2))))
      series.push({
        name:"Consumption prediccion",
        data: dataPred.slice()
      })

      // Serie nivel de agua
      let dataLevel = [];
      let dataMin=Array(this.mLColumns.length-1).fill(this.min.value);
      let dataMax=Array(this.mLColumns.length-1).fill(this.max.value);
      this.mLColumns.slice(1).forEach(element => {
        dataLevel.push(Number(this.mL[this.op.index][element].toFixed(2)))
      });
      series.push({
        name:"Tank Level",
        data: dataLevel
      })
      series.push({
        name:"Min",
        data: dataMin
      })
      series.push({
        name:"Max",
        data: dataMax
      })

      // Configuramos los ejes para tener un eje con nivel de agua y control y otro para consumo predicho

      let yaxisconfig = [
        {
          title: {
            text: "Control / Tank Level"
          },
          seriesName: ["Control","Tank Level", "Min", "Max"],
          min:0,
          max: Math.max(...dataLevel, 1.2)
        },
        {
          opposite: true,
          title: {
            text: "Consumption prediccion"
          },
          min: 0,
          max: Math.max(...this._prediccion)+1
        }
      ];

      console.log('series:',series)



      this.chartOptions = {
        series: series,
        chart: {
          height: 600,
          type: "line"
        },
        dataLabels: {
          enabled: false,
          // style: {
          //   colors: ['#2E93fA', '#66DA26', '#FF9800', '#E91E63', '#E91E63'],
          // }
        },
        stroke: {
          width: 5,
          colors: ['#2E93fA', '#66DA26', '#FF9800', '#E91E63', '#E91E63'],
          curve: "straight",
          dashArray: [0, 0, 0, 8, 8]
        },
        title: {
          text: this.title_explore,
          align: "left"
        },
        legend: {
          labels: {
            colors: ['#2E93fA', '#66DA26', '#FF9800', '#E91E63', '#E91E63'],
            useSeriesColors: false
          },
          markers: {
            strokeColor: ['#2E93fA', '#66DA26', '#FF9800', '#E91E63', '#E91E63'],
          },
          tooltipHoverFormatter: function(val, opts) {
            return (
              val + ": <strong>" +
              opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
              "</strong>"
            );
          }
        },
        markers: {
          size: 0,
          hover: {
            sizeOffset: 6
          }
        },
        yaxis:yaxisconfig,
        xaxis: {
          labels: {
            trim: false
          },
          categories: this.mPerColumns.slice(1)
        },
        tooltip: {
          y: [
            {
              title: {
                formatter: function(val) {
                  return val + " (ON/OFF)"
                }
              }
            },
            {
              title: {
                formatter: function(val) {
                  return val + " (m3)";
                }
              }
            },
            {
              title: {
                formatter: function(val) {
                  return val + " (m)";
                }
              }
            },
            {
              title: {
                formatter: function(val) {
                  return val + " (m)";
                }
              }
            },
            {
              title: {
                formatter: function(val) {
                  return val + " (m)";
                }
              }
            }
          ]
        },
        grid: {
          borderColor: "#f1f1f1"
        }
      };

    } else {
      // No hay optimo, vaciamos todo
      this.chartOptions = {
        series: [
        ],
        chart: {
          height: 350,
          type: "line"
        },
        dataLabels: {
          enabled: false
        },
        title: {
          text: this.title_explore,
          align: "left"
        },
        xaxis: {
          labels: {
            trim: false
          },
          categories: [
            "v0"
          ]
        },
        grid: {
          borderColor: "#f1f1f1"
        }
      };

    }

  }

  // Devuelve true si los campos del formulario son correctos
  validarCampos() {
    return (this.knn.valid && this.weekplus.valid && this.weekminus.valid
      && this.tl.valid && this.ps.valid && this.min.valid && this.max.valid && this.long.valid
      && this.wcm.valid && this.ppc.valid && this.constA.valid && this.constB.valid && this.constC.valid)
  }

  // Muestra mensaje de aviso y lo oculta
  mostrarMensaje(msg: string) {
    this._fuseAlertService.show(msg);
    setTimeout(() => this._fuseAlertService.dismiss(msg), environment.timer)
  }

  // Extraemos del campo fecha una variable fecha
  getFecha() {
    // El campo fecha puede ser un string o Moment, dependiendo de quien haya puesto la fecha, asi unificamos
    const fecha = new Date(String(this.fecha))
    return new Date(fecha.getFullYear(), fecha.getMonth(), fecha.getDate(), fecha.getHours(), fecha.getMinutes())
  }

}
