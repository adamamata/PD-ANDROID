import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { debounce } from 'lodash';
import { useCallback, useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import { connect } from "react-redux";
import emojiIcons from "../../assets/images/emoji-icons.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';

export declare interface SendBoxProps {
  /**
   * Optional boolean to disable text box
   * @defaultValue false
   */
  disabled?: boolean;

  emojiWidthBox: number;
  /**
   * Optional callback called when message is sent
   */
  onSendMessage: (content: string) => Promise<void>;
  /**
   * Optional callback called when user is typing
   */
  onTyping: () => Promise<void>;
  type?: string;
  onChange?: (value: any) => void;
}

const SendBox = (props: SendBoxProps): JSX.Element => {
  const { disabled, emojiWidthBox, onSendMessage, onTyping, type, onChange } = props;
  const [message, setMessage] = useState("");
  const [emojiBox, setEmojiBox] = useState(false);
  const [emojiBoxBottom, setEmojiBoxBottom] = useState(0);
  const [emojiBoxRight, setEmojiBoxRight] = useState(0);

  const sendBoxWrapper = useRef<any>();
  const textArea = useRef<any>();
  const insertEmoji = (value: string) => {
    const sendBox = textArea.current
    let [start, end] = [sendBox.selectionStart, sendBox.selectionEnd];

    if (!start) {
      start = sendBox.value.length;
    }
    if (!end) end = 0;

    if (!start && !end) {
      sendBox.value = value;

      setMessage(value);

      sendBox.focus();
      return;
    }

    sendBox.setRangeText(value, start, end);
    sendBox.selectionStart = start + value.length;
    setMessage(sendBox.value);

    sendBox.focus();
  }

  const handleEnterKey = async (sender: any) => {
    if (sender.shiftKey) {
      let currentHeight = sender.target.clientHeight;
      if (currentHeight <= 180) {
        currentHeight += 36;
      }

      sender.target.setAttribute("style", "height: " + currentHeight + "px");
    } else {
      sender.preventDefault();
      if (!message) return;
      await onSendMessage(message);
      setMessage("");
      sender.target.setAttribute("style", "height: 36px");
    }
  }

  const debounceDropDown = useCallback(debounce(async () => await onTyping(), 1000), []);

  const onKeyDown = async (sender: any) => {
    if (message && message.length == 1) {
      await onTyping();
    }

    await debounceDropDown();

    if (sender.keyCode == 13) {
      await handleEnterKey(sender);
      return;
    }

    if (sender.keyCode == 8 || sender.keyCode == 46) {
      const rows = sender.target.value.split('\n').length;
      let currentHeight = 36;
      if (currentHeight > 0) {
        currentHeight = 36 * rows;
      }

      sender.target.setAttribute("style", "height: " + currentHeight + "px");
      sender.target.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }
  }

  const onButtonClick = async () => {
    if (!message) return;
    await onSendMessage(message);
    setMessage("");
    const sendBox = textArea.current
    sendBox?.target?.setAttribute("style", "height: 36px");
  }

  const onMessageChanged = (event: any) => {
    textArea.current.style.height = "0px";
    const scrollHeight = textArea.current.scrollHeight;
    if (scrollHeight > 36) {
      textArea.current.style.height = scrollHeight + "px";
    }
    setMessage(event.target.value);
  }

  const showEmojiBox = () => {
    let emoji = false;

    const sendBoxWrapEle = sendBoxWrapper.current as HTMLDivElement;
    const sendBoxEle = sendBoxWrapEle.getElementsByClassName("ms-TextField")[0] as HTMLDivElement;
    const bodyClientRect = document.body.getBoundingClientRect();
    const boundingClientRect = sendBoxEle.getBoundingClientRect();
    if (isMobile) {
      setEmojiBoxRight(0);
    } else {
      setEmojiBoxRight(Math.abs(boundingClientRect.right - bodyClientRect.right + 40));
    }

    setEmojiBoxBottom(boundingClientRect.height + 10);

    setEmojiBox(e => { emoji = e; return e });
    setEmojiBox(!emoji);
  }

  const onEmojiClick = (emoji: EmojiClickData, event: MouseEvent) => {
    insertEmoji(emoji.emoji);
  }

  return (
    <div className={"send-box-wrapper "}>
      {
        emojiBox && (
          <div className="absolute z-10" style={{ bottom: emojiBoxBottom + "px", right: emojiBoxRight + "px" }}>
            <EmojiPicker width={emojiWidthBox} lazyLoadEmojis={true} onEmojiClick={onEmojiClick} />
          </div>
        )
      }
      {
        <div ref={sendBoxWrapper} className="ms-Stack">
        <div className="ms-Stack">
          <div className="ms-Stack">
            <div className="">
              <div className="ms-Stack icon-wrapper attach-button z-10 cursor-pointer">
                <div className="ms-TooltipHost root-175">
                  <button>
                    <label className="custom-file-upload">
                      <input
                        type="file"
                        className="hidden"
                        multiple={false}
                        onChange={(e) => {
                          onChange!(e);
                        }}
                      />

                      <FontAwesomeIcon icon={faPaperclip} className="text-primary text-xl cursor-pointer"/>
                    </label>
                  </button>
                </div>
              </div>

              <div className="ms-TextField ms-TextField--multiline root-161">
                <div className="ms-TextField-wrapper wrapper-162">
                  <div className="ms-TextField-fieldGroup fieldGroup-163">
                    <textarea ref={textArea} id="send-box"
                      data-ui-id="sendbox-textfield"
                      placeholder="Enter a message"
                      className="ms-TextField-field ms-TextField--unresizable field-164" aria-invalid="false"
                      aria-multiline={true}
                      value={message}
                      onKeyDown={onKeyDown}
                      onChange={onMessageChanged} >
                    </textarea>
                  </div >
                </div >
              </div >

              <div className="ms-Stack icon-wrapper action-button">
                <div className="ms-TooltipHost root-175">
                  <button className="pr-4" onClick={showEmojiBox}>
                    <img src={emojiIcons} alt="emoji-icons" width="22px" height="22px" />
                  </button>
                  <button type="button" className="ms-Button ms-Button--icon root-188" id="sendIconWrapper" aria-label="Send message" data-is-focusable="true" onClick={onButtonClick}>
                    <span className="ms-Button-flexContainer flexContainer-177" data-automationid="splitbuttonprimary">
                      <i data-icon-name="SendBoxSend" aria-hidden="true" className="root-184">
                        <span aria-hidden="true">
                          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className="svg" fill="currentColor">
                            <path d="M2.72 2.05l15.36 7.57a.5.5 0 010 .9L2.72 18.07a.5.5 0 01-.7-.58l1.97-7.43-1.97-7.44a.5.5 0 01.7-.58zm.54 1.38l1.61 6.09.07-.02H12a.5.5 0 01.09 1H5a.5.5 0 01-.1 0l-1.63 6.2 13.45-6.63L3.26 3.43z"></path>
                          </svg>
                        </span>
                      </i>
                    </span>
                  </button>
                </div>
              </div>
            </div >
          </div >
        </div >
      </div >
      }

    </div >
  );
};

export default connect()(SendBox);