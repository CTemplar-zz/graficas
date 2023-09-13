<template>
  <v-container class="my-5">
    
    <v-card class="mb-5">

      <v-card-title>
        Filtrar datos
      </v-card-title>

      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              :items="typeGraph"
              item-text="label"
              item-value="val"
              label="Tipo de gráfica"
              dense
              outlined
              v-model="type"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6">
            <v-radio-group
              v-model="typeTime"
              row
            >
              <v-radio
                label="Mensual"
                value="mensual"
              ></v-radio>
              <v-radio
                label="Anual"
                value="anual"
              ></v-radio>
            </v-radio-group>
          </v-col>

          <v-col cols="12" sm="6" v-if="typeTime == 'mensual'">
            <v-select
              :items="years"
              label="Año"
              dense
              outlined
              v-model="year"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6" v-if="typeTime == 'anual'">
            <v-select
              :items="years"
              label="Desde"
              dense
              outlined
              v-model="yearStart"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" v-if="typeTime == 'anual'">
            <v-select
              :items="years"
              label="Hasta"
              dense
              outlined
              v-model="yearEnd"
            ></v-select>
          </v-col>
          
          <v-col cols="12" sm="6">
            <v-select
              :items="stations"
              item-text="label"
              item-value="val"
              label="Estación metereologica"
              dense
              outlined
              multiple
              v-model="station"
              @input="limiter"
            ></v-select>
          </v-col>

        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="printResult">Imprimir</v-btn>
        <v-btn
          color="primary"
          :loading="!loading"
          @click="showGraphFilter"
        >
          Filtrar
        </v-btn>
      </v-card-actions>

    </v-card>

    <!-- graphic -->
    <v-card id="print" :loading="!loading">
      <v-card-text>
        <line-chart v-if="loading" :labels="labels" :values="dataGraph"></line-chart>
      </v-card-text>
    </v-card>
    <!-- graphic END -->

  </v-container>
</template>

<script>
  // import HelloWorld from '../components/HelloWorld'
  var tmpColor = ['#009688', '#CDDC39', '#E57373']
  export default {
    name: 'Home',
    // components: {
    //   HelloWorld,
    // },
    data() {
      return {
        typeGraph: [
          {val: '"Temperatura Mínima"', label: 'Temperatura Mínima'},
          {val: '"Temperatura Máxima"', label: 'Temperatura Máxima'},
          {val: 'Precipitación', label: 'Precipitación'}
        ],
        type: '"Temperatura Mínima"',
        typeTime: 'mensual',
        stations: [],
        station: [],
        color: '',
        months: [
          'Enero',
          'Febrero',
          'Marzo',
          'Abril',
          'Mayo',
          'Junio',
          'Julio',
          'Agosto',
          'Septiembre',
          'Octubre',
          'Noviembre',
          'Diciembre'
        ],
        monthStart: 'Enero',
        monthEnd: 'Diciembre',
        years: [],
        year: 2000,
        yearStart: 2000,
        yearEnd: 2022,
        labels: [],
        values: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ],
        loading: false,
        dataGraph: [],
        // data
        jsonData: require('../assets/graficas.json') 
      }
    },
    mounted() {
      // console.log(this.jsonData.data);
      this.jsonData.data.forEach(element => {
        if (this.years.indexOf(+element.year) == -1) {
          this.years.push(+element.year)
        }
        
        if (!this.containsObject({label: element.station, val: element.idstation}, this.stations)) {
          this.stations.push({label: element.station, val: element.idstation})
        }
      });

      this.showGraphFilter()
    },
    methods: {
      containsObject(obj, list) {
          var i;
          for (i = 0; i < list.length; i++) {
            if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
              return true;
            }
          }
          return false;
      },
      limiter(e) {
        if(e.length > 2) {
          alert('solo puedes seleccionar dos opciones')
          e.pop()
        }
      },
      showGraphFilter() {
        // {
        //   label: this.title,
        //   data: this.values,
        //   borderColor: this.color, //CDDC39
        //   backgroundColor: 'transparent',
        // },
        this.loading = false
        this.values = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        this.dataGraph = []


        // build graph
        switch (this.type) {
          case '"Temperatura Mínima"':
            this.minimumTemperatureGraph()
            break;
          case '"Temperatura Máxima"':
            this.maximumTemperatureGraph()
            break;
          case 'Precipitación':
            this.precipitationGraph()
            break;
          default:
            break;
        }
        // build graph END

        setTimeout(() => {
          this.loading = true
        }, 500);
      },

      minimumTemperatureGraph() {
        if (this.typeTime == 'mensual') {

          // filter statios
          var mainData = []
          mainData = this.jsonData.data.filter(row => +row.year === this.year)

          if (this.station.length > 0) {
            // filtro por estaciones
              var tmpMainData = []
              var j = 0
            this.station.forEach(id => {
              tmpMainData = []
              tmpMainData = mainData.filter(item => item.idstation === +id)

              var tmpValues2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              var tmpCantMonth2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              tmpMainData.forEach(element => {
                tmpCantMonth2[+element.month-1]++
    
                if (element[this.type]) {
                  tmpValues2[+element.month-1] += (+element[this.type])
                }
              });
    
              if (this.type == '"Temperatura Mínima"') {
                for (let i = 0; i < tmpCantMonth2.length; i++) {
                  if (tmpCantMonth2[i] > 0) {
                    tmpValues2[i] = tmpValues2[i]/tmpCantMonth2[i]
                  }
                }
              }

              this.dataGraph.push({
                label: `Temperatura Mínima - ${(tmpMainData.length > 0) ? tmpMainData[0].station : ''}`,
                data: tmpValues2,
                borderColor: tmpColor[j], //CDDC39
                backgroundColor: 'transparent',
              })

              j++
            });
            // filtro por estaciones END
          } else {
            // todas las estaciones
            var tmpValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            var tmpCantMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            mainData.forEach(element => {
              tmpCantMonth[+element.month-1]++
  
              if (element[this.type]) {
                tmpValues[+element.month-1] += (+element[this.type])
              }
            });
  
            if (this.type == '"Temperatura Mínima"') {
              for (let i = 0; i < tmpCantMonth.length; i++) {
                if (tmpCantMonth[i] > 0) {
                  tmpValues[i] = tmpValues[i]/tmpCantMonth[i]
                }
              }
            }

            this.dataGraph.push({
              label: 'Temperatura Mínima',
              data: tmpValues,
              borderColor: '#009688', //CDDC39
              backgroundColor: 'transparent',
            })
            // todas las estaciones END
          }

          this.labels = this.months
        }

        /**
         * anual
         */
        if (this.typeTime == 'anual') {
          this.labels = this.years.slice(this.years.indexOf(this.yearStart), this.years.indexOf(this.yearEnd)+1)

          // filter statios
          var mainData = []
          mainData = this.jsonData.data.filter(row => {
            return this.labels.includes(+row.year)
          })

          if (this.station.length > 0) {
            // filtro por estaciones
              var tmpMainData = []
              var j = 0
            this.station.forEach(id => {
              tmpMainData = []
              tmpMainData = mainData.filter(item => item.idstation === +id)

              var tmpValuesYear2 = Array.from({length: this.labels.length}, ()=>0 )
              var tmpCantYear2 = Array.from({length: this.labels.length}, ()=>0 )
              tmpMainData.forEach(element => {
                tmpCantYear2[this.labels.indexOf(+element.year)]++
    
                if (element[this.type]) {
                  tmpValuesYear2[this.labels.indexOf(+element.year)] += (+element[this.type])
                }
              });
    
              if (this.type == '"Temperatura Mínima"') {
                for (let i = 0; i < tmpCantYear2.length; i++) {
                  if (tmpCantYear2[i] > 0) {
                    tmpValuesYear2[i] = tmpValuesYear2[i]/tmpCantYear2[i]
                  }
                }
              }

              this.dataGraph.push({
                label: `Temperatura Mínima - ${(tmpMainData.length > 0) ? tmpMainData[0].station : ''}`,
                data: tmpValuesYear2,
                borderColor: tmpColor[j], //CDDC39
                backgroundColor: 'transparent',
              })

              j++
            });
            // filtro por estaciones END
          } else {
            // todas las estaciones
            var tmpValuesYear = Array.from({length: this.labels.length}, ()=>0 )
            var tmpCantYear = Array.from({length: this.labels.length}, ()=>0 )
            mainData.forEach(element => {
              tmpCantYear[this.labels.indexOf(+element.year)]++
  
              if (element[this.type]) {
                tmpValuesYear[this.labels.indexOf(+element.year)] += (+element[this.type])
              }
            });
  
            if (this.type == '"Temperatura Mínima"') {
              for (let i = 0; i < tmpCantYear.length; i++) {
                if (tmpCantYear[i] > 0) {
                  tmpValuesYear[i] = tmpValuesYear[i]/tmpCantYear[i]
                }
              }
            }

            this.dataGraph.push({
              label: 'Temperatura Mínima',
              data: tmpValuesYear,
              borderColor: '#009688', //CDDC39
              backgroundColor: 'transparent',
            })
            // todas las estaciones END
          }
        }
      },

      maximumTemperatureGraph() {
        if (this.typeTime == 'mensual') {

          // filter statios
          var mainData = []
          mainData = this.jsonData.data.filter(row => +row.year === this.year)

          if (this.station.length > 0) {
            // filtro por estaciones
              var tmpMainData = []
              var j = 0
            this.station.forEach(id => {
              tmpMainData = []
              tmpMainData = mainData.filter(item => item.idstation === +id)

              var tmpValues2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              var tmpCantMonth2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              tmpMainData.forEach(element => {
                tmpCantMonth2[+element.month-1]++
    
                if (element[this.type]) {
                  tmpValues2[+element.month-1] += (+element[this.type])
                }
              });
    
              if (this.type == '"Temperatura Máxima"') {
                for (let i = 0; i < tmpCantMonth2.length; i++) {
                  if (tmpCantMonth2[i] > 0) {
                    tmpValues2[i] = tmpValues2[i]/tmpCantMonth2[i]
                  }
                }
              }

              this.dataGraph.push({
                label: `Temperatura Máxima - ${(tmpMainData.length > 0) ? tmpMainData[0].station : ''}`,
                data: tmpValues2,
                borderColor: tmpColor[j], //CDDC39
                backgroundColor: 'transparent',
              })

              j++
            });
            // filtro por estaciones END
          } else {
            // todas las estaciones
            var tmpValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            var tmpCantMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            mainData.forEach(element => {
              tmpCantMonth[+element.month-1]++
  
              if (element[this.type]) {
                tmpValues[+element.month-1] += (+element[this.type])
              }
            });
  
            if (this.type == '"Temperatura Máxima"') {
              for (let i = 0; i < tmpCantMonth.length; i++) {
                if (tmpCantMonth[i] > 0) {
                  tmpValues[i] = tmpValues[i]/tmpCantMonth[i]
                }
              }
            }

            this.dataGraph.push({
              label: 'Temperatura Máxima',
              data: tmpValues,
              borderColor: '#009688', //CDDC39
              backgroundColor: 'transparent',
            })
            // todas las estaciones END
          }

          this.labels = this.months
        }

        /**
         * anual
         */
        if (this.typeTime == 'anual') {
          this.labels = this.years.slice(this.years.indexOf(this.yearStart), this.years.indexOf(this.yearEnd)+1)

          // filter statios
          var mainData = []
          mainData = this.jsonData.data.filter(row => {
            return this.labels.includes(+row.year)
          })

          if (this.station.length > 0) {
            // filtro por estaciones
              var tmpMainData = []
              var j = 0
            this.station.forEach(id => {
              tmpMainData = []
              tmpMainData = mainData.filter(item => item.idstation === +id)

              var tmpValuesYear2 = Array.from({length: this.labels.length}, ()=>0 )
              var tmpCantYear2 = Array.from({length: this.labels.length}, ()=>0 )
              tmpMainData.forEach(element => {
                tmpCantYear2[this.labels.indexOf(+element.year)]++
    
                if (element[this.type]) {
                  tmpValuesYear2[this.labels.indexOf(+element.year)] += (+element[this.type])
                }
              });
    
              if (this.type == '"Temperatura Máxima"') {
                for (let i = 0; i < tmpCantYear2.length; i++) {
                  if (tmpCantYear2[i] > 0) {
                    tmpValuesYear2[i] = tmpValuesYear2[i]/tmpCantYear2[i]
                  }
                }
              }

              this.dataGraph.push({
                label: `Temperatura Máxima - ${(tmpMainData.length > 0) ? tmpMainData[0].station : ''}`,
                data: tmpValuesYear2,
                borderColor: tmpColor[j], //CDDC39
                backgroundColor: 'transparent',
              })

              j++
            });
            // filtro por estaciones END
          } else {
            // todas las estaciones
            var tmpValuesYear = Array.from({length: this.labels.length}, ()=>0 )
            var tmpCantYear = Array.from({length: this.labels.length}, ()=>0 )
            mainData.forEach(element => {
              tmpCantYear[this.labels.indexOf(+element.year)]++
  
              if (element[this.type]) {
                tmpValuesYear[this.labels.indexOf(+element.year)] += (+element[this.type])
              }
            });
  
            if (this.type == '"Temperatura Máxima"') {
              for (let i = 0; i < tmpCantYear.length; i++) {
                if (tmpCantYear[i] > 0) {
                  tmpValuesYear[i] = tmpValuesYear[i]/tmpCantYear[i]
                }
              }
            }

            this.dataGraph.push({
              label: 'Temperatura Máxima',
              data: tmpValuesYear,
              borderColor: '#E57373', //CDDC39
              backgroundColor: 'transparent',
            })
            // todas las estaciones END
          }
        }
      },

      precipitationGraph() {
        if (this.typeTime == 'mensual') {
          // filter statios
          var mainData = []
          mainData = this.jsonData.data.filter(row => +row.year === this.year)

          if (this.station.length > 0) {
            // filtro por estaciones
              var tmpMainData = []
              var j = 0
            this.station.forEach(id => {
              tmpMainData = []
              tmpMainData = mainData.filter(item => item.idstation === +id)

              var tmpValues2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
              tmpMainData.forEach(element => {
                if (element[this.type]) {
                  tmpValues2[+element.month-1] += (+element[this.type])
                }
              });

              this.dataGraph.push({
                label: `Precipitación - ${(tmpMainData.length > 0) ? tmpMainData[0].station : ''}`,
                data: tmpValues2,
                borderColor: tmpColor[j], //CDDC39
                backgroundColor: 'transparent',
              })

              j++
            });
            // filtro por estaciones END
          } else {
            // todas las estaciones
            var tmpValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            mainData.forEach(element => {
              if (element[this.type]) {
                tmpValues[+element.month-1] += (+element[this.type])
              }
            });

            this.dataGraph.push({
              label: 'Precipitación',
              data: tmpValues,
              borderColor: '#009688', //CDDC39
              backgroundColor: 'transparent',
            })
            // todas las estaciones END
          }

          this.labels = this.months
        }

        /**
         * anual
         */
        if (this.typeTime == 'anual') {
          this.labels = this.years.slice(this.years.indexOf(this.yearStart), this.years.indexOf(this.yearEnd)+1)

          // filter statios
          var mainData = []
          mainData = this.jsonData.data.filter(row => {
            return this.labels.includes(+row.year)
          })

          if (this.station.length > 0) {
            // filtro por estaciones
              var tmpMainData = []
              var j = 0
            this.station.forEach(id => {
              tmpMainData = []
              tmpMainData = mainData.filter(item => item.idstation === +id)

              var tmpValuesYear2 = Array.from({length: this.labels.length}, ()=>0 )
              tmpMainData.forEach(element => {
                if (element[this.type]) {
                  tmpValuesYear2[this.labels.indexOf(+element.year)] += (+element[this.type])
                }
              });

              this.dataGraph.push({
                label: `Precipitación - ${(tmpMainData.length > 0) ? tmpMainData[0].station : ''}`,
                data: tmpValuesYear2,
                borderColor: tmpColor[j], //CDDC39
                backgroundColor: 'transparent',
              })

              j++
            });
            // filtro por estaciones END
          } else {
            // todas las estaciones
            var tmpValuesYear = Array.from({length: this.labels.length}, ()=>0 )
            mainData.forEach(element => {
              if (element[this.type]) {
                tmpValuesYear[this.labels.indexOf(+element.year)] += (+element[this.type])
              }
            });

            this.dataGraph.push({
              label: 'Precipitación',
              data: tmpValuesYear,
              borderColor: '#009688', //CDDC39
              backgroundColor: 'transparent',
            })
            // todas las estaciones END
          }
        }
      },

      printResult() {
        var canvasEle = document.getElementById('line-chart');
        var win = window.open('', 'Print', 'height=600,width=800');
        win.document.write("<br><img src='" + canvasEle.toDataURL() + "' />");
        setTimeout(function(){ //giving it 200 milliseconds time to load
                win.document.close();
                win.focus()
                win.print();
                win.location.reload()
        }, 200);
      }
    },
  }
</script>
