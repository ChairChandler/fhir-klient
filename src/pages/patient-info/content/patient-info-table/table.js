import React from 'react';

export class PatientTable extends React.Component {
    render = () => {
        const rows = []
        for (const { field, value } of this.props.data) {
            rows.push(<tr>
                <th scope="row">{field}</th>
                <td>{value}</td>
            </tr>)
        }

        return <>
            <table className="table table-striped table-bordered table-sm" style={{ 'background-color': 'white' }}>
                <tbody>
                    {rows}
                </tbody>
            </table>
        </>
    }
}