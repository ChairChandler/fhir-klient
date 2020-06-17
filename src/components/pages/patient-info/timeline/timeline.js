import React from 'react';
import MaterialTable from 'material-table';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';


class PatientInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            observations: [],
            loading: true
        }
        this.download()
    }

    download = async () => {
        const bs = await fetch(`${this.props.endpoint}?pid=${this.props.id}`)
        const data = await bs.json()

        console.log(data)
        const observations = this.prepareObservationData(data.observation)
        this.setState({ observations, loading: false })
    }

    prepareObservationData = (observations) => {
        const dataToVisualise = []

        for (const o of observations) {
            const { effectiveDateTime, status, valueQuantity, component } = o
            if (status !== 'final') {
                continue
            }

            const observationType = o.code.text
            if (valueQuantity) {
                var { value, unit } = valueQuantity
            } else {
                var components = component?.map(c => {
                    const observationType = c.code.text
                    const { value, unit } = c.valueQuantity
                    return {
                        observationType, value: `${Number(Number.parseFloat(value).toFixed(1))} ${unit}`
                    }
                })
            }

            dataToVisualise.push({
                observationType,
                effectiveDateTime,
                value: valueQuantity ? `${Number(Number.parseFloat(value).toFixed(1))} ${unit}` : null,
                components
            })
        }
        return dataToVisualise
    }

    /*preparePatientData = (patient) => {
        for(const p of patient) {
            p.resourceType
            p.meta.lastUpdated


        }
    }*/

    parseDate = (date) => {
        const k = new Date(date)
        return `${k.getDate()}/${k.getMonth()}/${k.getFullYear()} - ${k.getHours()}:${k.getMinutes()}`
    }

    render = () => {

        const observationTimeline = <div className="timeline-page">
            <VerticalTimeline>
                {
                    this.state.observations.map(o =>
                        <VerticalTimelineElement
                            className="vertical-timeline-element--work"
                            contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                            contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                            date={this.parseDate(o.effectiveDateTime)}
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
                    )
                }
            </VerticalTimeline>
        </div>

        return <>{observationTimeline}</>
    }
}

export default PatientInfo