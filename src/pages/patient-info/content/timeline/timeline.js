import React from 'react';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './style.css'

export class PatientInfo extends React.Component {
    constructor(props) {
        super(props)
        const { observations, medications } = this.props.data
        this.state = {
            observations: observations,
            medications: medications,
            loading: !observations || !medications
        }
    }

    componentWillReceiveProps = (nextProps) => {
        const { observations, medications } = nextProps.data
        const state = {
            observations: observations,
            medications: medications,
            loading: !observations || !medications
        }
        this.setState(state)
        console.log(state)
    }

    parseDate = (date) => {
        const k = new Date(date)
        return `${k.getDate()}/${k.getMonth()}/${k.getFullYear()} - ${k.getHours()}:${k.getMinutes()}`
    }

    onChangeMinDate = () => {

    }

    onChangeMaxDate = () => {

    }

    render = () => {

        if (!this.state.observations || !Object.keys(this.state.observations).length) {
            return <></>
        }

        const observationTimeline = <div id="timeline">
            <VerticalTimeline>
                {
                    Object.keys(this.state.observations).map(d =>
                        this.state.observations[d].map(o =>
                            <VerticalTimelineElement
                                className="vertical-timeline-element--work"
                                contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                                contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                                date={this.parseDate(d)}
                                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                                icon={<AssignmentOutlinedIcon />}
                            >
                                <h3 className="vertical-timeline-element-title">{o.observationType}</h3>
                                {
                                    o.value ?
                                        <p>{o.value}</p>
                                        :
                                        o.components.map(c =>
                                            <h4 className="vertical-timeline-element-subtitle">
                                                {c.observationType}
                                                <p>{c.value}</p>
                                            </h4>
                                        )
                                }
                            </VerticalTimelineElement>
                        ))
                }
            </VerticalTimeline>
        </div>

        return <>
            <input
            type="datetime-local"
            min="2018-06-07T00:00"
            max="2018-06-14T00:00"
            onChange={this.onChangeMinDate}
            />

            <input
            type="datetime-local"
            min="2018-06-07T00:00"
            max="2018-06-14T00:00"
            onChange={this.onChangeMaxDate}
            />

            {observationTimeline}
        </>
    }
}

export default PatientInfo