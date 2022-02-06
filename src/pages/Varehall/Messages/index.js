import React, { Fragment } from 'react';

import io from 'socket.io-client'
// import RESTCall from '../../screens/restApi'
import FlatList from 'flatlist-react';
// type Props = {
//   userId: number;
//   enabled: boolean;
//   onConnected?: () => void;
// }

// type Message = {
//   comment:string;
//   senderId: string;
//   userId: string;
//   date: new Date();
// }

// Import getNews from news.js
import { getNews } from '../api';
// import Article from './article';
import Comments from './Comments';


const fullWidth = Dimensions.get("window").width;
const fullHeight = Dimensions.get("window").height;




export default class Messages extends React.Component {
   _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      refreshing: false,
      comment:'',
      // chatMessage:'',
      chatMessages:[]
    };
    this.socket = io("https://vare-chatsocket.herokuapp.com/");
    // this.socket = io("http://localhost:5000/");

  }

 componentDidMount() { //alert(3)

   const { navigation : { state: { params } } } = this.props
   if(params){
     this.setState({
       ...params
     },()=>{
       // console.log('xxxz',this.state)
     })
   }
   this.updateUserInfo()

    this.loadMessages()
    this._isMounted = true;
  }

  async updateUserInfo(){
    const myInfo = await AppStore.get('myInfo')
    // console.log(myInfo)
    this.setState({
      'name': myInfo
      && myInfo['fullName']
      ? myInfo['fullName']
      : 'NA',
      'userId':Constants.installationId
    },()=>{
      // console.log('updateUserInfo',this.state)
    })
  }

  async shareMessage({message,title,url}){
    try {
    const result = await Share.share({
        message: message ? message : 'Welcome to VARE',
        title:title ? title : 'VARE APP',
        url:url ? url : '',
    });

    // if (result.action === Share.sharedAction) {
    //    alert("Post Shared")
    // } else if (result.action === Share.dismissedAction) {
    //   // dismissed
    //    alert("Post cancelled")
    // }
  } catch (error) {
     // alert('error.message');
  }
};

//get all msg via socket io
  loadMessages(){
    this.socket.on("chat message", msg => {
      // console.log('chatMessages',msg)
      this.setState({
        chatMessages:[...this.state.chatMessages,msg]
      },()=>{
        // console.log('chatMessages',this.state.chatMessages)
      })
    })
  }

  //send new message and return all msgs via socket io
  submitChatMessage(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
    // console.log(date + ' '+ time);

    const chatMessage = {
      meeting_id:this.state.meeting_id,
      picture: "09",
      comment:this.state.comment,
      senderId: this.state.name,
      userId: this.state.userId,
      name:this.state.name,
      date: date && time ? date +' '+time :''
    }
    this.socket.emit("chat message", chatMessage)
    this.setState({
      chatMessage:''
    },()=>{
      this.textInput=''
    })
  }

  getMeetingChats(chat) {
     const installId = Constants.installationId
     // alert(chat)
     if(chat){
        const formData = {
          request:'search',
          query: chat,
          resource:'vare_chats'
        }
        RESTCall.axiosQuery(formData)
        .then(res => {
            if(res && res.data){
              this.setState({
                chatMessages:res.data
              },()=>{
                // console.log('chatMessage',res.data)
              })
            }

         })
      }
   }

   saveMessageLikes(message,id){
     var today = new Date();
     var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
     var time = today.getHours()+':'+today.getMinutes()+':'+today.getSeconds();
     // console.log(date + ' '+ time);

     const chatMessage = message
     const temp = {...message}
      delete temp['_id']
      // console.log(temp)
      this.socket.emit("chat message", temp)

      this.getMeetingChats({
         meeting_id:message.meeting_id
      })
   }



  componentWillUnmount() {
    this._isMounted = false;
  }

  handleRefresh() {
    this.setState(
      {
        refreshing: true
      },
      () => {}
    );
  }
//




  // saveMeetingMessages(message) {
  //    const installId = Constants.installationId
  //    // alert(token)
  //    if(message){
  //       const formData = {
  //         request:'insert',
  //         query: message,
  //         resource:'vare_meetings',
  //         check:["member_id","meeting_id"]
  //       }
  //       RESTCall.axiosQuery(formData)
  //       .then(res => {
  //            // console.log('messageInfo',message)
  //        })
  //     }
  //  }




  render() {
    const { filter} = this.props
    const {
      articles,
      // message,
      member_id,
      comment,
      chatMessages,
    } = this.state

     // console.log('chatMessages',this.state.chatMessages)

    return (<div
      style={{
        backgroundColor: this.props.bgColor
        ? this.props.bgColor
        : 'white',
        alignItems:'center',
        paddingBottom:100
        // width:'100%'
      }}>
        <TextInput
            onSubmitEditing={()=>{
              this.submitChatMessage()
            }}
            ref={input => { this.textInput = input }}
           // maxLength={3}
           style={{
            color:'gray',
            height: 50,
            width:fullWidth,
            borderColor: 'black',
            //borderBottomWidth: 0.2,
            backgroundColor: '#f2f3f5',
            paddingLeft:10,
            fontSize: 16,
           }}
           onChangeText= {(text) => {
                this.setState({
                  comment: text
                },()=>{
                  // console.log('comment',this.state.comment)
                })
             }}
          />


        {chatMessages && chatMessages.length > 0
          ? <FlatList
          ItemSeparatorComponent={() => <div style={stylesScroll.seperator} />}
          horizontal={false}
          // inverted={true}
          showsHorizontalScrollIndicator={true}
          data={chatMessages ? chatMessages : []}
          renderItem={({ item }) => <div
          style = {{
      			width:fullWidth
      		}}>
              <Comments
                {...item}
                {...this.props}
                shareMessage={this.shareMessage.bind(this)}
                saveMessageLikes={this.saveMessageLikes.bind(this)}
               />
           </div>}
          keyExtractor={(item,i) => 'hvfvdgk54hhgh'+i}
          refreshing={this.state.refreshing}
          onRefresh={this.handleRefresh.bind(this)}
        />
        : null
        }

        {chatMessages && chatMessages.length == 0
          ? <div style={{
            width:fullWidth*0.8,
            paddingTop:20
          }}>
          <Text>
            Please wait while we load the discussions during this meeting.  If no message is loaded then it could be that there are no new meetings or messages posted by this Representative at this time; or they may not yet be subscribed to Vare Townhall.
          </Text>
        </div>: null
       }

     </div>
    );
  }
}

const stylesScroll = {
	seperator: {
		width: 2
  }
}
