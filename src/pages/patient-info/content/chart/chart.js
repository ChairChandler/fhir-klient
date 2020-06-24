import React from 'react'
import Chart from 'chart.js'
import './style.css'

export class MeasureChart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

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

        const actualLabel = labels[0]
        this.setState({ labels, datasets, chart, actualLabel },
            () => this.setDataToChart(actualLabel))
    }

    setDataToChart = (label, { dateBegin = null, dateEnd = null } = {}) => {
        this.setState(state => {
            let labels = this.state.datasets[label].map(({ date }) => this.parseDateChart(date))
            let data = this.state.datasets[label].map(({ value }) => value)

            if (dateBegin || dateEnd) {
                const newLabels = [], newData = []
                const min = dateBegin ?? this.state.minDate
                const max = dateEnd || this.state.maxDate
                for (const [index, date] of Object.entries(labels)) {
                    if (min < date && date < max) {
                        newLabels.push(date)
                        newData.push(data[index])
                    }
                }
                labels = newLabels
                data = newData
            } else {
                state.minDate = this.parseDateInput(labels[0])
                state.maxDate = this.parseDateInput(labels.slice(-1)[0])
            }

            state.chart.data = {
                labels, datasets: [{ data }]
            }
            return state
        }, () => this.state.chart.update())
    }

    parseData = (data) => {
        const datasets = {}
        for (const [date, array] of Object.entries(data)) {

            // eslint-disable-next-line no-loop-func
            const recursive = (array) => {
                for (const i of array) {
                    const field = { date, value: Number.parseFloat(i.value?.split(' ')[0] ?? 0) }
                    if (field.value) {
                        if (datasets[i.observationType]) {
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

    parseDateChart = date => {
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
        this.setState(state => {
            state.actualLabel = newMeasure
            delete state.minDate
            delete state.maxDate
            delete state.minDateSearch
            delete state.maxDateSearch
        }, () => this.setDataToChart(newMeasure))
    }

    onChangeMinDateSearch = date => {
        this.setState(state => {
            state.minDateSearch = this.parseDateInput(date)
            return state
        }, () => this.setDataToChart(this.state.actualLabel, {
            dateBegin: this.state.minDateSearch,
            dateEnd: this.state.maxDateSearch
        }))
    }

    onChangeMaxDateSearch = date => {
        this.setState(state => {
            state.maxDateSearch = this.parseDateInput(date)
            return state
        }, () => this.setDataToChart(this.state.actualLabel, {
            dateBegin: this.state.minDateSearch,
            dateEnd: this.state.maxDateSearch,
        }))
    }

    parseDateInput = date => {
        const k = new Date(date)
        let month = k.getMonth() + 1
        let day = k.getDate()

        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }

        return `${k.getFullYear()}-${month}-${day}`
    }

    render = () => <>
        <div className="container">
            <div>
                <div className="col chart-container">
                    <canvas id="chart" />
                </div>
                <div className="col container">
                    <div className="row">
                        <div className="col-1">
                            <label style={{ marginRight: '20px', color: 'white' }}>Measure</label>
                        </div>

                        <div className="col">
                            <select onChange={e => this.onMeasureChange(e.target.value)}>
                                {
                                    this.state?.labels?.map(
                                        label => <option value={label}>{label}</option>
                                    )
                                }
                            </select>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-1">
                            <label style={{ marginRight: '20px', color: 'white' }}>Min</label>
                        </div>

                        <div className="col">
                            <input
                                type="date"
                                min={this.state.minDate}
                                max={this.state.maxDateSearch ?? this.state.maxDate}
                                onChange={ev => this.onChangeMinDateSearch(ev.target.value)}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-1">
                            <label style={{ marginRight: '20px', color: 'white' }}>Max</label>
                        </div>

                        <div className="col">
                            <input
                                type="date"
                                min={this.state.minDateSearch ?? this.state.minDate}
                                max={this.state.maxDate}
                                onChange={ev => this.onChangeMaxDateSearch(ev.target.value)}
                            />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    </>
}