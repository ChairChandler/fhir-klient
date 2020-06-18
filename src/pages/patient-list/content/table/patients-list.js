import React from 'react';
import MaterialTable from 'material-table';

export class PatientsList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: this.props.data,
            columns: this.props.columns
        }
    }

    componentWillReceiveProps = (nextProps) => {
        this.setState({ data: nextProps.data, columns: nextProps.columns })
    }

    render = () => (
        <MaterialTable
            title="Patients"
            columns={this.state.columns ?? []}
            data={this.state.data ?? []}
            isLoading={!this.state.columns || !this.state.data}
            onRowClick={(ev, row) => this.props.onPatientSelected(row.id)}
        >
        </MaterialTable>
    )
}