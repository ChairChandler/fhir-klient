import React from 'react'
import Chart from 'chart.js'
import './style.css'

export class MeasureChart extends React.Component {
    componentDidMount = () => {
        const { labels, datasets } = this.parseData(this.props.data)

        const ctx = document.getElementById('chart').getContext('2d')
        const chart = new Chart(ctx, {
            type: 'line',
            options: {
                responsive: false,
                maintainAspectRatio: false

            }
        })

        this.setState({ labels, datasets, chart },
            () => this.setDataToChart(labels[0]))
    }

    setDataToChart = (label) => {
        this.state.chart.data = {
            labels: this.state.datasets[label].map(({ date }) => this.parseDate(date)),
            datasets: [{
                data: this.state.datasets[label].map(({ value }) => value)
            }]
        }
        this.state.chart.update()
    }

    parseData = (data) => {
        const datasets = {}
        let counter = 1
        for (const [dateStr, array] of Object.entries(data)) {

            const date = new Date(dateStr)
            // eslint-disable-next-line no-loop-func
            const recursive = (array) => {
                for (const i of array) {
                    const field = { date, value: Number.parseFloat(i.value?.split(' ')[0] ?? 0) } // lekka modyfikacja danych aby zaprezentowac wykres
                    if (field.value) {
                        if (datasets[i.observationType]) {
                            field.date = new Date(field.date.getTime() + 1000 * counter++)
                            field.value += 2 * Math.random() - 1
                            datasets[i.observationType].push(field)
                        } else {
                            datasets[i.observationType] = [field]
                        }
                    }

                    if (i.components) {
                        recursive(i.components)
                    }
                }
            }

            recursive(array)
        }

        return { labels: Object.keys(datasets), datasets: datasets }
    }

    parseDate = date => {
        const k = new Date(date)
        let month = k.getMonth() + 1
        let day = k.getDate()

        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }

        return `${k.getFullYear()}-${month}-${day} ${k.getHours()}:${k.getMinutes()}:${k.getSeconds()}`
    }

    onMeasureChange = newMeasure => {
        this.setDataToChart(newMeasure)
    }

    render = () => <>
        <div className="container">
            <div>
                <div className="col chart-container">
                    <canvas id="chart" />
                </div>
                <div className="col">
                    <div style={{ display: 'flex' }}>
                        <label style={{ marginRight: '20px', color: 'white' }}>Measure</label>
                        <select onChange={e => console.log(e.target.value)}>
                            {
                                this.state?.labels?.map(
                                    label => <option value={label}>{label}</option>
                                )
                            }
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </>
}