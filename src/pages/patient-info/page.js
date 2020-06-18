import React from 'react';
import { Navbar } from 'src/components/navbar/navbar'
import { PatientInfo } from './content/timeline/timeline'
import { PatientTable } from './content/patient-info-table/table'
import PatientListPage from 'src/pages/patient-list/page'
import { PatientInfoService } from 'src/services/patient-info'
import './style.css'

export default class extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
        this.asyncInit()
    }

    asyncInit = async () => {
        this.setState(await PatientInfoService.download(this.props.id))
    }

    render = () => {
        const nav = <Navbar
            buttons={[
                { title: 'Home', onClick: () => this.props.onChangeComponent({ dest: PatientListPage }) }
            ]} />

        const baseInfo = <PatientTable data={!this.state.patient ? [] :
            Object.keys(this.state.patient).map(
                key => ({ field: key[0].toUpperCase() + key.slice(1).toLowerCase(), value: this.state.patient[key] }))} />

        const timeline = <PatientInfo
            data={{
                medications: this.state.medications ?? [],
                observations: this.state.observations ?? []
            }} />

        return <>
            {nav}
            <div className={"min-padding " + (this.state.medications?.length || this.state.observations?.length ? "grey" : '')}>
                <div id="table-patient-info">{baseInfo}</div>
            </div>
            {timeline}
        </>
    }
}