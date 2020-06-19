import React from 'react';
import Modal from '@trendmicro/react-modal';
import '@trendmicro/react-modal/dist/react-modal.css';

export class DialogInfo extends React.Component {
    prepareObservationData = (observation) => {
        let title, body
        title = 'Observation'
        body = <>
            <tr>
                <th>{observation.observationType}</th>
                <td>{observation.value ?? "empty"}</td>
            </tr>
            {
                observation.components?.map(o =>
                    <tr>
                        <th>{o.observationType}</th>
                        <td>{o.value ?? "empty"}</td>
                    </tr>
                )
            }
        </>

        return { title, body }
    }

    prepareMedicationData = (medication) => {
        let title, body
        title = 'Medication'
        body = <>
            <tr>
                <th>{medication.medicationType}</th>
                <td>{medication.value ?? "empty"}</td>
            </tr>

            <tr>
                <th>Doctor</th>
                <td>{medication.doctor ?? "empty"}</td>
            </tr>

            {
                medication.dosageInstruction ?
                    <>
                        <tr>
                            <th>As needed</th>
                            <td>{medication.dosageInstruction.asNeeded ? "true" :
                                medication.dosageInstruction.asNeeded === undefined ? "empty" : "false"}</td>
                        </tr>
                        <tr>
                            <th>Dosage timing</th>
                            <td>{medication.dosageInstruction.dosageTiming ?? "empty"}</td>
                        </tr>
                        <tr>
                            <th>Dose quantity</th>
                            <td>{medication.dosageInstruction.doseQuantity ?? "empty"}</td>
                        </tr>
                    </>
                    :
                    null
            }
        </>

        return { title, body }
    }

    render = () => {
        const data = this.props.data
        let info
        if (data.observationType) {
            info = this.prepareObservationData(data)
        } else {
            info = this.prepareMedicationData(data)
        }

        return <Modal size='sm' onClick={this.props.onClose}>
            <Modal.Header>
                {info.title}
            </Modal.Header>
            <Modal.Body padding>
                <table className='table table-bordered'>
                    {info.body}
                </table>
            </Modal.Body>
        </Modal>
    }
}