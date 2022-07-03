import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const ModalTheme = ({ report }) => {
    const [isOpen, setIsOpen] = useState(true)

    return (
        <div className={'theme-modal-success'}>
            <Modal
                isOpen={isOpen}
                className='modal-dialog-centered'
                modalClassName={'modal-success'}
            >
                <ModalHeader>Simulación Finalizada</ModalHeader>
                <ModalBody>
                    <b>Cantidad de Pedidos Atendidos: </b> {report.ordersTotal} <hr></hr>
                    <b>Cantidad de Rutas Generadas:</b> {report.cantRutas} <hr></hr>
                    <b>Tiempo promedio de entrega:</b> {report.promTiempo} <hr></hr>
                </ModalBody>
                <ModalFooter>
                    <Button color={'success'} onClick={() => setIsOpen(false)}>
                        OK
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}
export default ModalTheme