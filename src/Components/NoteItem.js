import React, { useContext } from 'react'
import noteContext from '../Context/notes/noteContext';

const NoteItem = (props) => {
    const context = useContext(noteContext)
    const { deleteNote } = context;
    const { note,updateNote } = props;
    return (
        <div className="col-md-3 my-3">
            <div className="card">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">{note.title}</h5>
                        <i className="far fa-trash-alt mx-3" onClick={()=>{
                            deleteNote(note._id);props.showAlert("Deleted SucessFully","success")
                        }}></i>
                        <i className="fa-solid fa-pen-to-square" onClick={()=>{
                            updateNote(note)
                        }}></i>
                    </div>
                    <p className="card-text">{note.description}</p>
                </div>
            </div>
        </div>
    )
}

export default NoteItem