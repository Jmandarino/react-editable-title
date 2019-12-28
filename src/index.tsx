import React, { useState, useCallback, useRef, useMemo, CSSProperties } from 'react'
import '../src/css/index.css'

interface EditableProps {
  text: string;
  editButton?: boolean;
  editControlButtons?: boolean;
  placeholder?: string;
  seamlessInput?: boolean;
  textStyle?: CSSProperties;
  inputStyle?: CSSProperties;
  editButtonStyle?: CSSProperties;
  saveButtonStyle?: CSSProperties;
  cancelButtonStyle?: CSSProperties;
  cb: (currentText: string) => any;
}

/**
 * Keyboard Event Key-codes
 */
enum Key {
  Enter = 13,
  ESC = 27
}

const Editable: React.FC<EditableProps> = ({
  text,
  editButton = false,
  editControlButtons = false,
  placeholder = 'Type Here',
  seamlessInput = false,
  textStyle,
  inputStyle,
  editButtonStyle,
  saveButtonStyle,
  cancelButtonStyle,
  cb
}) => {
  const [editing, setEditing] = useState(false)
  const [displayText, setDisplayText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const displayTextRef = useRef<HTMLSpanElement>(null)

  const handleClickOnText = useCallback(
    () => {
      setEditing(!editing)
      setDisplayText(text)
      /* 
         A little hack to wait event-loop to flush-out itself
         The issue is, when the user clicked on the text 
         or the edit button, the focus instantly being given
         to the input element. But, it`s not visible at the moment.
         By calling the `setTimeout`, function call will be done
         after the event-loop has executed all the functions.
      */
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0);
    },
    [editing],
  )

  const updateDisplayText = useCallback(
    () => {
      setDisplayText(inputRef.current?.value || '*')
    },
    [],
  )

  const terminateEditing = useCallback(
    () => {
      setEditing(false)
    },
    [],
  )

  const handleKeyDown = useCallback(
    (event) => {
      const stroke = event.keyCode || event.which

      if (stroke === Key.Enter && text !== inputRef.current?.value) {
        handleSaveText()
        terminateEditing()
      } else if (stroke === Key.ESC) {
        terminateEditing()
      }
    },
    [text],
  )

  const handleSaveText = useCallback(
    () => {
      terminateEditing()
      if (inputRef.current) {
        cb(inputRef.current.value)
        inputRef.current.value = ''
      }
    },
    [],
  )

  const calculateDimensions = useMemo(() => {
    return {
       width: displayTextRef.current?.offsetWidth,
       height: displayTextRef.current?.offsetHeight 
      }
  }, [editing])

  return useMemo(() => {
    return (
      <React.Fragment>
  
          <div 
            className='title-wrapper'
            style={seamlessInput ? calculateDimensions : undefined}>
            <input 
              className=
              {
                `${seamlessInput ? 'seamlessInput' : 'customTitleInput'} 
                 ${editControlButtons ? '' : 'bendRightSide'}`
              }
              style={editing ? {...inputStyle} : { display: 'none' }}
              ref={inputRef} 
              placeholder={placeholder}
              value={displayText}
              onChange={updateDisplayText}
              onKeyDown={handleKeyDown}/>
            <span
              ref={displayTextRef}
              className='displayText' 
              style={!editing ? {...textStyle} : { display: 'none' }} 
              onClick={handleClickOnText}>
                {text}
            </span>
            {
              editButton ? 
                <button
                  className={`mainButton edit ${editButton ? 'showControl' : 'hideControl'}`}
                  style={!editing ? {...editButtonStyle} : { display: 'none' }}
                  onClick={handleClickOnText}>
                    <i className="gg-pen" />
                </button>
                :
                undefined
            }
            {
              editControlButtons ? 
                <React.Fragment>
                  <button
                    className={`mainButton save ${editControlButtons ? 'showControl' : 'hideControl'}`} 
                    style={editing ? {...saveButtonStyle} : { display: 'none' }}
                    onClick={handleSaveText}
                    disabled={text === displayText}>
                      <i className="gg-check" />
                  </button>
                  <button
                    className={`mainButton cancel ${editControlButtons ? 'showControl' : 'hideControl'}`} 
                    style={editing ? {...cancelButtonStyle} : { display: 'none' }}
                    onClick={terminateEditing}>
                      <i className="gg-close" />
                  </button>
                </React.Fragment>
                :
                undefined
            }
          </div>
  
      </React.Fragment>
    )
  }, [displayText, editing])
}

export default Editable