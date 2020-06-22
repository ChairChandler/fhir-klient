import React from 'react';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import FavoriteBorderOutlinedIcon from '@material-ui/icons/FavoriteBorderOutlined';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './timeline-style.css'
import { DialogInfo } from './modal'

export class PatientInfo extends React.Component {
    constructor(props) {
        super(props)
        const { observations, medications } = this.props.data
        const timeline = this.connectIntoTimeline(observations, medications)
        this.state = {
            timeline,
            loading: !Object.keys(timeline).length
        }
    }

    componentWillReceiveProps = nextProps => {
        const { observations, medications } = nextProps.data
        const minDate = this.parseDateToDateInput(this.findMinDate(observations, medications))
        const maxDate = this.parseDateToDateInput(this.findMaxDate(observations, medications))
        const timeline = this.connectIntoTimeline(observations, medications)

        this.setState(state => {
            state = {
                minDate, maxDate, timeline,
                loading: false,

            }
            return state
        }, () => this.setState(state => {
            state.filteredTimeline = this.filterTimeline()
            return state
        }))
    }

    connectIntoTimeline = (...data) => {
        const timeline = {}
        for (const d of data) {
            for (const [date, array] of Object.entries(d)) {
                if (date in timeline) {
                    timeline[date].push(...array)
                } else {
                    timeline[date] = array
                }
            }
        }
        return timeline
    }

    parseDateToTimeLineDate = date => {
        const k = new Date(date)
        return `${k.getDate()}/${k.getMonth() + 1}/${k.getFullYear()} - ${k.getHours()}:${k.getMinutes()}`
    }

    parseDateToDateInput = date => {
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

    findMinDate = (observations, medications) => {
        const obsKeys = Object.keys(observations)
        const medKeys = Object.keys(medications)

        let minDateO = obsKeys.reduce((a, b) => a < b ? a : b, Number.MAX_VALUE)
        let minDateM = medKeys.reduce((a, b) => a < b ? a : b, Number.MAX_VALUE)

        return minDateO < minDateM ? minDateO : minDateM
    }

    findMaxDate = (observations, medications) => {
        const obsKeys = Object.keys(observations)
        const medKeys = Object.keys(medications)

        let maxDateO = obsKeys.reduce((a, b) => a > b ? a : b, Number.MIN_VALUE)
        let maxDateM = medKeys.reduce((a, b) => a > b ? a : b, Number.MIN_VALUE)

        return maxDateO > maxDateM ? maxDateO : maxDateM
    }

    onChangeMinDateSearch = date => {
        this.setState(state => {
            state.minDateSearch = this.parseDateToDateInput(date)
            return state
        }, () => this.setState(state => {
            state.filteredTimeline = this.filterTimeline()
            return state
        }))
    }

    onChangeMaxDateSearch = date => {
        this.setState(state => {
            state.maxDateSearch = this.parseDateToDateInput(date)
            return state
        }, () => this.setState(state => {
            state.filteredTimeline = this.filterTimeline()
            return state
        }))
    }

    filterTimeline = () => {
        const min = new Date(this.state.minDateSearch ?? this.state.minDate)
        const max = new Date(this.state.maxDateSearch ?? this.state.maxDate)

        min.setHours(0, 0, 0, 0)
        max.setHours(23, 59, 59, 59)

        const filtered = {}
        for (const [dateKey, list] of Object.entries(this.state.timeline)) {
            const date = new Date(dateKey)
            if (min <= date && date <= max) {
                filtered[dateKey] = list
            }
        }

        return filtered
    }

    onClickIcon = (date, arrayIndex) => {
        const data = this.state.filteredTimeline[date][arrayIndex]
        this.setState(state => {
            state.dialogData = data
            return state
        })
    }

    render = () => {

        if (this.state.loading || !Object.keys(this.state.timeline).length) {
            return <></>
        }

        const timelineElements = []
        for (const [date, list] of Object.entries(this.state.filteredTimeline ?? {})) {
            for (const index in list) {
                const v = list[index]

                const icon = 'observationType' in v ? <AssignmentOutlinedIcon /> : <FavoriteBorderOutlinedIcon />
                const timelineDate = this.parseDateToTimeLineDate(date)
                const title = 'observationType' in v ? 'Observation' : 'Medication'
                const text = v.observationType ?? v.medicationType

                const el = <VerticalTimelineElement
                    className="vertical-timeline-element--work"
                    contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                    contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                    iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                    date={timelineDate}
                    icon={icon}
                    iconOnClick={() => this.onClickIcon(date, index)}
                >
                    <h3 className="vertical-timeline-element-title">{title}</h3>
                    <p>{text}</p>
                </VerticalTimelineElement>

                timelineElements.push(el)
            }
        }

        const observationTimeline = timelineElements.length ? <VerticalTimeline>{timelineElements}</VerticalTimeline> : null

        return <div id="timeline">

            <div id="date-container">
                <div className="date-container-element">
                    <label>Min</label>
                    <input
                        type="date"
                        min={this.state.minDate}
                        max={this.state.maxDateSearch ?? this.state.maxDate}
                        onChange={ev => this.onChangeMinDateSearch(ev.target.value)}
                    />
                </div>

                <div className="date-container-element">
                    <label>Max</label>
                    <input
                        type="date"
                        min={this.state.minDateSearch ?? this.state.minDate}
                        max={this.state.maxDate}
                        onChange={ev => this.onChangeMaxDateSearch(ev.target.value)}
                    />
                </div>
            </div>

            {observationTimeline}

            {
                this.state.dialogData &&
                <DialogInfo data={this.state.dialogData} onClose={() => this.setState(state => delete state.dialogData)}/>
            }
        </div>
    }
}

export default PatientInfo