import Vue from 'vue';

// graph
import { VueCharts } from 'vue-chartjs'
Vue.component('line-chart', {
    extends: VueCharts.Line,
    props: ['labels', 'values'],
    mounted () {
        this.renderChart(
            {
                labels: this.labels,
                datasets: this.values
            },
            {
                responsive: true,
                legend: {
                    display: true
                },
                maintainAspectRatio: false,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        )
    }
})
