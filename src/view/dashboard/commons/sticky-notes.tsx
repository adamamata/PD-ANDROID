import React, { useState, useEffect, useRef, useCallback } from "react";
import { debounce } from 'lodash';
import { CKEditor } from "ckeditor4-react";

import moreVert from "../../../assets/images/moreVert.svg";
import deleteIcon from "../../../assets/images/delete.svg";
import autoSavedIcon from "../../../assets/images/auto-saved.svg";
import autoSaveDoneIcon from "../../../assets/images/auto-saved-done.svg";
import listNotes from "../../../assets/images/event-note.svg";
import { connect, useSelector } from "react-redux";
import { auth_details } from "../../../reducer/auth";
import RctPageLoader from "../../../component/RctPageLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { addNote, deleteNote, getNotes, updateNote } from "../../../services/homeService";
import { Note, NotePosition } from "../../../models/note.model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";

interface Cprops {
  roomId: string;
  userId: string;
  onClosed: () => void;
}

const StickyNotes: React.FC<any> = (props: Cprops | any) => {
  const profile = useSelector(auth_details);
  const defaultColor = "#FFE66E";
  const settingHeaderWrapper = useRef<HTMLDivElement>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [listNote, setListNote] = useState<boolean | undefined>();
  const [activeNote, setActiveNote] = useState<Note>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [editorConfig, setEditorConfig] = useState<any>();

  const colors = ["#FFE66E", "#A1EF9C", "#FFAFDF", "#D7AFFF", "#9EDFFF", "#E0E0E0", "#757575"]

  const toolbarEditor = {
    language: 'en-US',
    toolbar: [
      {name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike']},
      {name: 'paragraph', items: ['NumberedList', 'BulletedList']}],
    toolbarLocation: 'bottom',
    removePlugins: 'elementspath, resize, magicline, Subscript,Superscript'
  }

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (settingHeaderWrapper.current && !settingHeaderWrapper.current.contains(event.target)) {
        const settingHeader = document.getElementById("setting-header");

        if (settingHeader) {
          if (settingHeader.classList.contains("active")) {
            settingHeader.classList.remove("active");
          }
        }
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    getNoteData();
  }, []);

  useEffect(() => {
    if (listNote === undefined) {
      return;
    }
    
    if (listNote) {
      getNoteData();
    }

    showNoteOption();
  }, [listNote]);

  useEffect(() => {
    const listNoteEle = document.getElementById("list-notes") as HTMLDivElement;
    if (listNoteEle)
    dragElement(listNoteEle, true);
  }, [notes, listNote]);

  useEffect(() => {
    if (activeNote) {
      const noteEle = document.getElementById("active-notes") as HTMLDivElement;
      if (noteEle) {
        dragElement(noteEle, false);
      }
    }
  }, [activeNote]);

  useEffect(() => {
    if (!activeNote && !listNote && !isLoading) {
      props.onClosed();
    }
  }, [activeNote, listNote]);

  function newNote() {
    return new Note({
      color: defaultColor,
      isDeleted: false,
      roomId: props.roomId,
      userId: props.userId,
      position: new NotePosition()
    });
  }

  function getNoteData() {
    const { dispatch } = props;
    setIsLoading(true);
    dispatch(getNotes(props.roomId, props.userId))
    .then((res: any) => {
      let note: Note;
      if (res.data.data && res.data.data.notes.length > 0) {
        const mappedNotes = res.data.data.notes.map((_: Note) => new Note(_));

        setNotes(mappedNotes);
        if (!activeNote) {
          note = mappedNotes[0];
        } else {
          note = mappedNotes.find((_: Note) => _.id == activeNote.id) || newNote();
        }
      } else {
        note = newNote();
        setNotes([note]);
      }
      
      setActiveNote(note);
      setIsLoading(false);
    }).catch((err: any) => {
      setIsLoading(false);
      toast.error(err.response?.data.message || err.message, {
        theme: "colored",
        autoClose: 3000,
      });
    });
  }

  function dragElement(elmnt: HTMLDivElement, isList: boolean = false) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const header = document.getElementById(elmnt.id + "-header");
    if (header) {
      // if present, the header is where you move the DIV from:
      header.onmousedown = dragMouseDown;
    } else {
      // otherwise, move the DIV from anywhere inside the DIV:
      elmnt.onmousedown = dragMouseDown;
    }
  
    function dragMouseDown(e: any) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
  
    function elementDrag(e: any) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  
    function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;

      if (!isList && activeNote) {
        activeNote.position.top = elmnt.offsetTop;
        activeNote.position.left = elmnt.offsetLeft;
        setActiveNote({...activeNote});
        updateSNote();
      }
    }
  }
  
  function closeActiveNote() {
    setActiveNote(undefined);
  }

  function showHideActiveNote(note: Note) {
    if (activeNote && activeNote.id == note.id) {
      setActiveNote(undefined);  
    } else {
      setActiveNote(undefined);  
      setTimeout(() => {
        setActiveNote(n => {
          return note
        });
      }, 100);
      if (editorConfig) {
        setTimeout(() => {
          editorConfig.resetDirty();
          editorConfig.setData(note.content);
          if (!!editorConfig.document) {
            var doc = editorConfig.document.$;
            transparentContent(doc);
          }
        }, 300);
      }
    }
  }

  function showNoteOption() {
    const settingHeader = document.getElementById("setting-header");

    if (settingHeader) {
      if (settingHeader.classList.contains("active")) {
        settingHeader.classList.remove("active");
      } else {
        settingHeader.classList.add("active");
      }
    }
  }
 
  function updateSNote() {
    const {dispatch} = props;
    setIsSaving(true);
    dispatch(updateNote(activeNote)).then((res: any) => {
      setNotes([...notes]);
      setIsSaving(false);
    }).catch((err: any) => {
      setIsSaving(false);
      toast.error(err.response?.data.message || err.message, {
        theme: "colored",
        autoClose: 3000,
      });
    });
  }

  function changeActiveNoteColor(color: string) {
    if (activeNote) {
      activeNote.color = color;
      setActiveNote({...activeNote});
      showNoteOption();

      updateSNote();
    }
  }

  function addANote() {
    const {dispatch} = props;
    const note = newNote();

    dispatch(addNote(note)).then((res: any) => {
      const mappedNote = new Note(res.data.data);
      notes.push(mappedNote);
      closeActiveNote();
      setActiveNote(mappedNote);
      setNotes([...notes]);
    }).catch((err: any) => {
      toast.error(err.response?.data.message || err.message, {
        theme: "colored",
        autoClose: 3000,
      });
    });
  }

  function deleteTheNote(id: any) {
    const {dispatch} = props;

    dispatch(deleteNote(id)).then((res: any) => {
      const noteIndex = notes?.findIndex(_ => _.id == id);
      notes?.splice(noteIndex, 1);
      if (activeNote && id == activeNote.id) {
        closeActiveNote();
      }
      
      setNotes([...notes]);
    }).catch((err: any) => {
      toast.error(err.response?.data.message || err.message, {
        theme: "colored",
        autoClose: 3000,
      });
    });
  }

  function onLoaded(args: any) {
    setEditorConfig(args.editor);

    const editorid = args.editor.id;
    const ckBottom = document.getElementById(editorid + "_bottom");

    if (ckBottom) {
      document.getElementsByClassName("note-footer")[0].appendChild(ckBottom);
    }
  }
  
  const debounceDropDown = useCallback(
    debounce(async (editor, activeNote: Note, notes: Note[]) => {
      await saveNoteContent(editor, activeNote, notes);
    }, 1000), []);
  
  const saveNoteContent = async (editor: any, activeNote: Note, notes: Note[]) => {
    const {dispatch} = props;

    if (!activeNote) return;

    setIsSaving(true);
    setIsSaved(false);
    activeNote.content = editor.getData();

    let promise: any;
    const isUpdate = !!activeNote.id;
    if (isUpdate) {
      promise = dispatch(updateNote(activeNote));
    } else {
      promise = dispatch(addNote(activeNote));
    }

    promise.then((res: any) => {
      if (!isUpdate) {
        setActiveNote(new Note(res.data.data));
        getNoteData();
      } else {
        setActiveNote(activeNote);
      }
      
      setIsSaved(true);

      setTimeout(() => {
        setIsSaving(false);
        setIsSaved(false);
      }, 500);

      editor.resetDirty();
    }).catch((err: any) => {
      setIsSaving(false);
      setIsSaved(false);
      toast.error(err.response?.data.message || err.message, {
        theme: "colored",
        autoClose: 3000,
      });
    });
  }

  const detectChanged = async (args: any) => {
    const isDirty = args.editor.checkDirty();
    let isSave = false;

    setIsSaving(i => {isSave = i; return i;});

    const content = args.editor.getData();

    if (isDirty && !isSave && activeNote && content != activeNote.content) {
      await debounceDropDown(args.editor, activeNote, notes);
    }
  }

  const onInstanceReady = async (args: any) => {
    var doc = args.editor.document.$;
    transparentContent(doc);
  }

  function transparentContent(doc: any) {
    var style = doc.createElement("style");
    style.setAttribute("id", "dynamic-styles");
    style.appendChild(doc.createTextNode(""));

    doc.head.appendChild(style);

    style.sheet.insertRule('body { background-color: transparent; }', 0);
  }

  function closeNotes() {
    setListNote(undefined);
  }

  function showNotes() {
    setListNote(c => {return !c;});
  }

  return (
    <>
      {listNote && <>
        <div className="list-notes" id="list-notes">
          {isLoading && <RctPageLoader />}
          <div id="list-notes-header" className="note-header h-[45px] w-full">
            <div className="flex justify-between h-[30px] w-full items-center ">
              <div className="cursor-pointer">
                <FontAwesomeIcon icon={faPlus} className={`text-primary text-3xl`} onClick={addANote} />
              </div>
              <div>
              </div>
              <div className="cursor-pointer">
                <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} onClick={closeNotes} />
              </div>
            </div>
          </div>
          <div className="list-note-title text-3xl px-2">
            <h2>Notes</h2>
          </div>
          <div className="list-note-content w-full pl-2.5">
            <ul>
              {notes && notes.map((note: Note) => (
                <li key={note.id} style={{backgroundColor: note.color, borderColor: note.color}} className="" onClick={() => {showHideActiveNote(note)}}>
                  {note.created && 
                    <div className="note-created-on">
                      <div className="note-created-date-time">{(new Date(note.created)).toLocaleString()}</div>
                      <div className="cursor-pointer remove-note-item" onClick={(sender) => { sender.stopPropagation(); deleteTheNote(note.id);}}>
                        <img className="w-[20px] h-[20px]" src={deleteIcon} alt="delete"/>
                      </div>
                    </div>
                  }
                  {note.content && <div className="note-item-content" dangerouslySetInnerHTML={{ __html: note.content }}></div>}
                  {!note.content && <div className="note-item-content text-gray-400">Take a note...</div>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </>}
      {activeNote && <>
      <div id="active-notes" className="active-note w-[300px] h-[345px]" 
      style={{backgroundColor: activeNote.color, 
            top: activeNote.position.top, 
            bottom: activeNote.position.bottom, 
            left: activeNote.position.left}}>
        <div id="active-notes-header" className="note-header h-[45px] w-full">
          <div className="background" style={{backgroundColor: activeNote.color}}></div>
          <div className="flex justify-between h-[30px] w-full items-center relative">
            <div>
            </div>
            <div>
            </div>
            <div className="flex justify-end items-center w-[70px]">
              { isSaving && !isSaved && 
                (<div className="saving">
                  <img src={autoSavedIcon} alt="autoSaved" className="w-[24px] h-[24px]" />
                </div>)
              }
              { isSaving && isSaved &&
                (<div>
                 <img src={autoSaveDoneIcon} alt="autoSaveDone" className="w-[24px] h-[24px]" />
                </div>)
              }
              <div className="cursor-pointer">
                <img src={moreVert} alt="more" className="w-[24px] h-[24px]" onClick={showNoteOption} />
              </div>
              <div className="cursor-pointer" onClick={closeActiveNote}>
                <FontAwesomeIcon icon={faXmark} className={`text-primary text-3xl`} />
              </div>
            </div>
          </div>
        </div>
        <div ref={settingHeaderWrapper} id="setting-header" className="setting-header flex flex-col justify-between h-[125px] w-full items-center ">
          <div className="flex justify-between items-center w-full h-[40px]">
            {colors.map(color => (
              <div key={color} className="w-full h-[40px] cursor-pointer" style={{backgroundColor: color, borderColor: color}} onClick={() => {changeActiveNoteColor(color)}}></div>
            ))}
          </div>
          <div className="flex justify-left items-center w-full h-[45px] text-600 cursor-pointer" id="list-note-item" onClick={() => {showNotes()}}>
            <img src={listNotes} width="20px" height="20px" className="m-[2px]" alt="listNote"/>
            <span>Show List Note</span>
          </div>
          <div className="flex justify-left items-center w-full h-[45px] text-red-600 cursor-pointer" onClick={() => {deleteTheNote(activeNote.id)}}>
            <img src={deleteIcon} alt="delete"/>
            <span>Delete Note</span>
          </div>
        </div>
        <div className="note-content h-[calc(100%_-_90px)] w-full">
          <CKEditor initData={activeNote.content} config={toolbarEditor} onLoaded={onLoaded} onChange={detectChanged} onInstanceReady={onInstanceReady} />
        </div>
        <div className="note-footer absolute bottom-0 h-[45px] w-full">
        </div>
      </div>
      </>}
    </>
  );
};

export default connect()(StickyNotes);
