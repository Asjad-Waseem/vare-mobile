import React, {Fragment, useEffect, useRef, useState} from "react";

import {useParams} from "react-router-dom";
import io from "socket.io-client";
import UserAvatar from "react-user-avatar";
import moment from "moment";
import RESTCall from "../../../../redux/actions/restApi";
// import EmojiSelector, {Categories} from "react-native-emoji-selector";
import Picker from "emoji-picker-react";
import useLocalStorage from "./localStorage";

const fullWidth = window.screen.width;
const fullHeight = window.screen.height;

const insertEmoji = ({index, replace, text}) => {
  return (
    text.substr(0, index) +
    " " +
    replace +
    " " +
    text.substr(index + replace.length)
  );
};

export default class Comments extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      textPosition: 0,
      openEmoji: false,
      articles: [],
      refreshing: false,
      comment: "",
      loading: false,
      notices: [],
      messages: [],
      replyProfile: {},
      replyMessages: [],
      status: {sort: true},
      seaarchOptions: [
        {
          colorPill: "",
          info: "all"
        },
        {
          colorPill: "",
          info: "sort"
        }
      ]
    };
    // this.socket = io("http://localhost:5000");
    this.socket = io("https://media.varehall.com");
    this.textInput = this.state.comment;
  }

  componentDidMount() {
    // alert(3);
    const {params} = this.props;
    if (params) {
      delete params["seaarchOptions"];
      this.setState(
        {
          ...params,
          bill_id: params.item_id ? params.item_id : params.bill_id,
          comment: "",
          loading: true
          // messages: []
        },
        () => {
          this.loadComments();
          // }
          this.setState({
            // comment: "",
            loading: false
          });
          //   retu
        }
      );
    }
    this._isMounted = true;
  }

  async onEmojiClick(event, emojiObject) {
    // console.log("emojiObject", emojiObject && emojiObject.emoji);
    if (emojiObject && emojiObject.emoji)
      this.setState(
        {
          comment:
            this.state.comment &&
            this.state.textPosition < this.state.comment.length
              ? insertEmoji({
                  index: this.state.textPosition,
                  replace: emojiObject.emoji,
                  text: this.state.comment
                })
              : this.state.comment + " " + emojiObject.emoji,
          openEmoji: false
        },
        () => {
          // console.log("emoji", emoji);
        }
      );
  }

  async loadComments() {
    const {storeUser} = this.props;
    this.setState(
      {
        storeUser
      },
      () => {
        this.loadMessages();
      }
    );
  }

  //get all msg via socket io
  loadMessages() {
    // console.log("xc", this.state);
    if (this.state.item_id || this.state.bill_id || this.state.content_id) {
      this.socket.emit("chat message", [
        {
          content_id: this.state.item_id
            ? this.state.item_id
            : this.state.bill_id
            ? this.state.bill_id
            : this.state.content_id
        }
      ]);
      this.socket.on("chat message", msg => {
        // console.log("ggggmessagesxx", msg);
        // const newChats = msg.sort((a, b) => {
        //   var dateA = new Date(a.date).getTime();
        //   var dateB = new Date(b.date).getTime();
        //   return dateA > dateB ? -1 : 1;
        // });
        this.setState(
          {
            messages: [...msg],
            comment: "",
            loading: false
          },
          () => {
            // this.getMeetings();
            // console.log("messages", this.state.messages);
          }
        );
      });
    } else {
      this.setState({
        loading: false
      });
    }
  }

  //send new message and return all msgs via socket io
  submitChatMessage() {
    const {newComment} = this.state;

    const info = {...newComment, date: moment().format()};
    // console.log("uuuu", this.textInput.current, newComment);
    // return;

    if (this.state.comment && this.state.comment) {
      this.socket.emit("save chat", info);
      this.socket.on("chat message", msg => {
        // console.log("messagesxx", msg);
        // const newChats = msg.sort((a, b) => {
        //   var dateA = new Date(a.date).getTime();
        //   var dateB = new Date(b.date).getTime();
        //   return dateA > dateB ? -1 : 1;
        // });
        this.setState(
          {
            messages: [...msg],
            comment: "",
            loading: false,
            replyProfile: {},
            newComment: {}
          },
          () => {
            // this.getMeetings();
            console.log("messages", this.state.messages);
          }
        );
      });
    } else {
      alert("Message is empty");
    }
  }

  deleteChatMessage(props) {
    const {id} = props;
    const chat = {};
    chat._id = id;
    chat.content_id = this.state.item_id
      ? this.state.item_id
      : this.state.bill_id
      ? this.state.bill_id
      : this.state.content_id;
    chat.resource = "tube_comments";
    // console.log("delete", chat, this.state);
    this.socket.emit("delete chat", chat);
  }

  saveMessageLikes(message) {
    const chatMessage = message;
    const temp = {...message};
    delete temp["_id"];
    // console.log("temp", temp);
    this.socket.emit("save chat", temp);
    this.setState({
      replyProfile: {}
    });
  }

  openMessage() {}
  //

  componentWillUnmount() {
    this._isMounted = false;
  }

  filterAction(info) {
    //alert(info)
    this.setState({
      loading: true,
      refreshing: true,
      status: {}
    });

    const {status} = this.state;

    if (info.toLowerCase() == "sort".toLowerCase()) {
      status["sort"] = true;
      status["all"] = false;
      status["others"] = false;
      this.setState(
        {
          status,
          refreshing: false
        },
        () => {}
      );
    }
    if (info.toLowerCase() == "all") {
      status["sort"] = false;
      status["all"] = true;
      this.setState(
        {
          status,
          tabIndex: this.state.tabIndex == 1 ? 0 : 1,
          replyMessages: [],
          refreshing: false
        },
        () => {}
      );
    }
  }

  // console.log('newMessages',description)
  render() {
    const {
      storeUser,
      messages,
      refreshing,
      replyProfile,
      comment,
      replyMessages
    } = this.state;
    // console.log("newMessages", this.state);

    const CommentsInfo = ({props, setReplyIndex, index, numReplies}) => {
      return (
        <div
          onPress={() => {
            setReplyIndex(index);
          }}
          style={{
            flexDirection: "column"
          }}
        >
          <div
            style={{
              color: numReplies ? "#01b0f7" : "black"
            }}
          >
            {"       "}
            {numReplies ? numReplies : ""}{" "}
            <i
              className={`fas fa-comments`}
              style={{
                fontSize: 12,
                // paddingLeft: 6,
                // fontWeight: "bold",
                color: numReplies ? "#01b0f7" : "black"
              }}
            />
          </div>
        </div>
      );
    };

    const LikeInfo = props => {
      return (
        <div
          onPress={() => {
            const likeParsed = JSON.parse(props.likes);
            const likeArray =
              likeParsed &&
              likeParsed.length > 0 &&
              likeParsed.filter(res => res != null);

            const likedAlready =
              likeArray &&
              likeArray.length > 0 &&
              likeArray.filter(rep => {
                return (
                  rep.user_id && props.user_id && rep.user_id == props.user_id
                );
              });

            const removeLikedTemp =
              likedAlready &&
              likedAlready.length > 0 &&
              props.likes &&
              JSON.parse(props.likes).length &&
              JSON.parse(props.likes).length > 0 &&
              JSON.parse(props.likes).filter(
                rep =>
                  rep.user_id && props.user_id && rep.user_id != props.user_id
              );

            const removeLikedAlready =
              removeLikedTemp && removeLikedTemp.length > 0
                ? removeLikedTemp
                : "";

            this.saveMessageLikes({
              // ...props,
              date: props.date,
              content_id: props.bill_id ? props.bill_id : props.content_id,
              likes:
                likedAlready && likedAlready.length > 0
                  ? JSON.stringify(removeLikedAlready)
                  : JSON.stringify([
                      {
                        date: moment().format(),
                        name: storeUser && storeUser.name ? storeUser.name : "",
                        user_id:
                          storeUser && storeUser.user_id
                            ? storeUser.user_id
                            : this.state.email
                      }
                    ]),
              user_id:
                storeUser && storeUser.user_id
                  ? storeUser.user_id
                  : this.state.email
            });
          }}
          style={{
            flexDirection: "row"
          }}
        >
          <div>
            {props.likes &&
            JSON.parse(props.likes) &&
            JSON.parse(props.likes).length
              ? JSON.parse(props.likes).length
              : ""}{" "}
            <i
              className={`fas fa-thumbs-up`}
              style={{
                fontSize: 12,
                // paddingLeft: 6,
                // fontWeight: "bold",
                color: props.likes ? "#01b0f7" : "black"
              }}
            />
          </div>
        </div>
      );
    };

    const DeleteInfo = props => {
      return (
        <div
          onPress={() => {
            props.deleteChatMessage(props);
          }}
          style={{
            flexDirection: "column"
          }}
        >
          <div>
            {"       "}
            <i
              className={`fas fa-trash`}
              style={{
                fontSize: 12,
                // paddingLeft: 6,
                // fontWeight: "bold",
                color: "#2096F3"
              }}
            />
          </div>
        </div>
      );
    };

    const ReplyInfo = props => {
      return (
        <div
          onPress={() => {
            props.setReplyProfile(props);
          }}
          style={{
            flexDirection: "column"
          }}
        >
          <div>
            {"       "}
            <i
              className={`fas fa-reply-all`}
              style={{
                fontSize: 12,
                // paddingLeft: 6,
                // fontWeight: "bold",
                color: "black"
              }}
            />
          </div>
        </div>
      );
    };

    const myData =
      replyMessages && replyMessages.length > 0
        ? replyMessages
        : messages
        ? messages
        : [];

    return (
      <div
        style={{
          // backgroundColor: "white",
          alignItems: "center"
        }}
      >
        {replyProfile && replyProfile.name ? (
          <div
            onPress={() => {
              this.setState({
                replyProfile: {}
              });
            }}
            style={{
              backgroundColor: "#f2f3f5",
              position: "absolute",
              top: 1,
              zIndex: 4,
              left: 2,
              height: 35,
              flexDirection: "row"
            }}
          >
            <i
              className={`fas fa-times-circle`}
              style={{
                fontSize: 12,
                // paddingLeft: 6,
                // fontWeight: "bold",
                color: "black"
              }}
            />
            <div style={{fontSize: 14, padding: 5, color: "gray"}}>
              {replyProfile && Object.keys(replyProfile).length > 0
                ? // ? `@${replyProfile.name} ${replyProfile.date} \n ${replyProfile.comment}`
                  `@${replyProfile.name} `
                : ""}
            </div>
          </div>
        ) : null}
        <div
          onPress={() => {
            this.setState({
              openEmoji: this.state.openEmoji ? false : true
            });
          }}
          style={{
            position: "absolute",
            top: 0,
            right: 5,
            zIndex: 4
          }}
        >
          <i
            className={`fas fa-laugh`}
            style={{
              fontSize: 12,
              // paddingLeft: 6,
              // fontWeight: "bold",
              color: "#fcc334"
            }}
          />
        </div>
        <div
          onPress={() => {
            this.submitChatMessage();
          }}
          style={{
            position: "absolute",
            top: 50,
            right: 5,
            zIndex: 4
          }}
        >
          <i
            className={`fas fa-paper-plane`}
            style={{
              fontSize: 12,
              // paddingLeft: 6,
              // fontWeight: "bold",
              color: "#fcc334"
            }}
          />
        </div>

        <div
          style={{
            color: "black",
            minHeight: 90,
            width: fullWidth,
            marginRight: 5,
            // borderColor: "black",
            //borderBottomWidth: 0.2,
            backgroundColor: "#f2f3f5",
            paddingTop: 40,
            paddingLeft: 20,
            paddingBottom: 20,
            paddingRight: 50,
            // paddingTop: replyProfile && replyProfile.name ? 30 : 0,
            fontSize: 16
          }}
          placeholder={"Add your comments here.."}
          value={comment}
          multiline={true}
          onSelectionChange={selection => {
            this.setState(
              {
                textPosition:
                  selection.nativeEvent &&
                  selection.nativeEvent.selection &&
                  selection.nativeEvent.selection.end
                    ? selection.nativeEvent.selection.end
                    : 0
              },
              () => {
                // console.log("selection", this.state.textPosition);
              }
            );
          }}
          onSubmitEditing={() => {}}
          onFocus={() => {
            this.setState({
              openEmoji: false
            });
          }}
          ref={input => {
            this.textInput = input;
          }}
          // maxLength={3}
          onChangediv={text => {
            const comment = text;
            const res = this.state;
            const infoReply =
              replyProfile && replyProfile.name
                ? {
                    reply_id: replyProfile._id,
                    author_id: replyProfile.user_id,
                    author: replyProfile.name
                  }
                : {};

            this.setState({
              comment: text,
              newComment: {
                ...infoReply,
                comment: `${text}`,
                content_id: this.state.item_id
                  ? this.state.item_id
                  : this.state.bill_id
                  ? this.state.bill_id
                  : this.state.content_id,
                title: this.state.fullName
                  ? `${this.state.fullName} - ${this.state.label}`
                  : `${
                      this.state.item_id
                        ? this.state.item_id
                        : this.state.bill_id
                        ? this.state.bill_id
                        : this.state.content_id
                    } - ${
                      this.state.title //.substring(0, 40)
                    }`,
                name: storeUser && storeUser.name ? storeUser.name : "NA",
                user_id:
                  storeUser && storeUser.user_id
                    ? storeUser.user_id
                    : this.state.email,
                reply:
                  res.reply && res.reply.length && res.reply.length > 0
                    ? JSON.stringify([
                        ...res.reply,
                        {
                          date: moment().format(),
                          name: res && res.name,
                          user_id: res && res.userId,
                          comment: this.state.comment
                        }
                      ])
                    : JSON.stringify([
                        {
                          date: moment().format(),
                          name: res && res.name,
                          user_id: res && res.userId,
                          comment: this.state.comment
                        }
                      ]),
                likes:
                  res.likes && res.likes.length && res.likes.length > 0
                    ? JSON.stringify(res.likes)
                    : "",

                user_id:
                  storeUser && storeUser.user_id
                    ? storeUser.user_id
                    : this.state.email
              }
            });
            // this.setState({
            //   comment: text
            // });
          }}
        />
        <div style={{height: 50}}></div>
        <div
          style={{
            padding: 10,
            alignItems: "center",
            width: "90%"
          }}
        ></div>
        {myData &&
          myData.length > 0 &&
          myData.map((item, index) => {
            let replies = messages.filter(real => {
              // console.log("replies", real._id, item.reply_id);
              return real.reply_id == item._id;
            });
            replies = [item, ...replies];
            // console.log("repliesxxx", item, this.state);

            return (
              <Fragment>
                <div
                  style={{
                    marginBottom: 5,
                    backgroundColor: "#f2f3f5"
                    // width:'0%'
                  }}
                >
                  <div
                    useForeground
                    onPress={() => {}}
                    style={{
                      width: fullWidth,
                      paddingLeft: 10,
                      paddingRight: 10,
                      margin: 10,
                      // marginBottom:25,
                      flexDirection: "row"
                    }}
                  >
                    <div
                      style={{
                        flexDirection: "row"
                      }}
                    >
                      <div
                        onPress={() => {}}
                        style={{
                          width: 50,
                          height: 50,
                          marginRight: 10,
                          // borderWidth: 1,
                          borderRadius: 100
                          // borderColor: "#FA8072"
                        }}
                      >
                        <UserAvatar
                          size={50}
                          name={item && item.name ? item.name : "NA"}
                          // src={
                          //   item.user_id &&
                          //   `https://vareapp.com/images/app-image/${item.user_id.replace(
                          //     ".com",
                          //     ".jpg"
                          //   )}`
                          // }
                          component={
                            item.img ? (
                              <img
                                src={{uri: item.img}}
                                style={{
                                  width: 50, // Adding 1 to prevent background border from leaking
                                  height: 50
                                  // borderRadius: size / 2
                                }}
                              />
                            ) : (
                              undefined
                            )
                          }
                        />
                      </div>

                      <div
                        style={{
                          width: "80%"
                        }}
                      >
                        <div
                          onPress={() => {}}
                          style={{
                            paddingTop: 2,
                            flexDirection: "column",
                            width: "80%"
                          }}
                        >
                          <div
                            style={{
                              flexDirection: "row",
                              alignItems: "stretch"
                            }}
                          >
                            <div>{item.name}</div>
                            <div
                              style={{
                                position: "absolute",
                                right: 0
                              }}
                            >
                              <div>
                                {moment(item.date || moment.now()).fromNow()}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              color: "#01b0f7",
                              padding: 5
                            }}
                          >
                            {item.author ? `@${item.author} \n` : ""}
                            <div
                              style={{
                                fontSize: 12,
                                color: "gray"
                              }}
                            >
                              {item.comment}
                            </div>
                          </div>
                          <div
                            style={{
                              flexDirection: "row",
                              paddingTop: 2
                            }}
                          >
                            <LikeInfo
                              saveMessageLikes={this.saveMessageLikes.bind(
                                this
                              )}
                              {...item}
                            />
                            <ReplyInfo
                              setReplyProfile={e =>
                                this.setState({replyProfile: item})
                              }
                              {...item}
                            />
                            {(this.state.user_id &&
                              item.user_id &&
                              this.state.user_id == item.user_id) ||
                            (this.state.userId &&
                              item.user_id &&
                              this.state.userId == item.user_id) ||
                            (this.state.email &&
                              item.user_id &&
                              this.state.email == item.user_id) ? (
                              <DeleteInfo
                                deleteChatMessage={this.deleteChatMessage.bind(
                                  this
                                )}
                                id={item._id}
                              />
                            ) : null}
                            <CommentsInfo
                              setReplyIndex={e =>
                                this.setState({
                                  replyIndex: e,
                                  replyMessages: replies
                                })
                              }
                              numReplies={
                                replies && replies.length
                                  ? replies.length - 1
                                  : ""
                              }
                              props={item}
                              index={index}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          })}

        {this.state.openEmoji ? (
          <div
            style={{
              backgroundColor: "white",
              position: "absolute",
              top: 70,
              height: fullHeight * 0.6,
              paddingBottom: 30,
              zIndex: 3
            }}
          >
            <Picker onEmojiClick={this.onEmojiClick} />
          </div>
        ) : null}
      </div>
    );
  }
}

const stylesScroll = {
  seperator: {
    width: 2
  }
};
