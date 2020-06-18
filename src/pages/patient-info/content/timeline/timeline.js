import React from 'react';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import './style.css'

export class PatientInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            patient: [],
            observations: [],
            medications: [],
            loading: true
        }
        this.download()
    }

    download = async () => {
        const bs = await fetch(`${this.props.endpoint}?pid=${this.props.id}`)
        const data = await bs.json()

        const patient = this.preparePatientData(data.patient)
        const observations = this.prepareObservationData(data.observation)
        const medications = this.prepareMedicationData(data.medicationRequest)

        this.setState({ patient, observations, medications, loading: false })
        console.log(this.state)
    }

    prepareObservationData = (observations) => {
        const dataToVisualise = []

        for (const o of observations) {
            const { effectiveDateTime, valueQuantity, component } = o

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

    preparePatientData = (patient) => {
        const { birthDate, gender } = patient
        const { communication: { language: { text: language = null } = {} } = {} } = patient
        const { address: [{ city, country, state, postalCode, line: [street] }] } = patient
        const { name: [{ family: lastname, given: name, prefix: namePrefix }] } = patient

        return {
            name: `${namePrefix} ${name} ${lastname}`,
            birthDate,
            gender,
            language,
            address: `${street}, ${city} ${postalCode}, ${state}, ${country}`
        }
    }

    prepareMedicationData = (medication) => {
        const dataToVisualise = []

        for (const m of medication) {
            const { authoredOn, dosageInstruction } = m
            const { medicationCodeableConcept: { text: medicationType } } = m
            const { requester: { display: doctor } } = m

            const [{ asNeededBoolean: asNeeded, doseAndRate = null, timing = null }] = dosageInstruction ?? [{}]
            const [{ doseQuantity: { value: doseQuantity = null } = {} } = {}] = doseAndRate ?? []
            const { rate: dosageTiming = null } = timing ?? {}

            dataToVisualise.push({
                authoredOn, medicationType, doctor,
                dosageInstruction: {
                    asNeeded,
                    doseQuantity,
                    dosageTiming
                }
            })
        }

        return dataToVisualise
    }

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