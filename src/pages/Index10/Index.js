import React, { Fragment, Component, Suspense } from 'react';

import Modal from '../../components/Mandate/Modal.js';
import io from 'socket.io-client'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { memberRequested, providerRequested,invoiceRequested,handleQuery }
  from '../../redux/actions/keyInfoActions'
  import { logoutFromView }
  from '../../redux/actions/authActions'

const NavbarPage = React.lazy(() => import('../../components/Navbar/Navbar_Page'));
const Section = React.lazy(() => import('./section'));
const About = React.lazy(() => import('../../components/About/about'));
const Process = React.lazy(() => import('../../components/Process/process'));
const Portfolio = React.lazy(() => import('../../components/Portfolio/portfolio'));
const Counter = React.lazy(() => import('../../components/Counter/counter'));
const OurTeam = React.lazy(() => import('../../components/Team/our-team'));
const Footer = React.lazy(() => import('../../components/Footer/footer'));
const Testimonials = React.lazy(() => import('../../components/Testimonials/testimonials'));
const Pricing = React.lazy(() => import('../../components/Pricing/pricing'));
const Blog = React.lazy(() => import('../../components/Blog/blog'));
const Cta = React.lazy(() => import('../../components/Cta/Cta'));
const GetInTouch = React.lazy(() => import('../../components/GetInTouch/GetInTouch'));
const Signup = React.lazy(() => import('../../components/Signup'));
const Home = React.lazy(() => import('../../components/Home'));




class MyIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalStatus:false,
            navItems : [
                { id: 1 , idnm : "home", navheading: "Home" },
                // { id: 2 , idnm : "about", navheading: "About" }
                // { id: 3 , idnm : "portfolio", navheading: "Portfolio" },
                // { id: 4 , idnm : "team", navheading: "Team" },
                // { id: 5 , idnm : "testimonial", navheading: "Testimonial" },
                // { id: 6 , idnm : "pricing", navheading: "Pricing" },
                // { id: 7 , idnm : "blog", navheading: "Blog" },
                // { id: 8 , idnm : "contact", navheading: "Contact" },
            ],
            pos : document.documentElement.scrollTop,
            imglight : true,
            navClass : "",
            chatMessages:[{
                picture:'../../assets/images/02.jpg',
                comment:'test test etst test tetst tets fgd gf ffgdfgdgfd',
                senderId: 'test1',
                userId: 'test1',
                name:'Test User',
                date: new Date().toISOString().slice(0,10)
              }]
        };
    }

    componentDidMount() {
        window.addEventListener("scroll", this.scrollNavigation, true);
        this.socket = io("https://vare-middleware.herokuapp.com");
      // this.socket.on('disconnect', () => {
      //   console.log('disconnected');
      // });
      this.socket.on("chat message", msg => {
        // console.log('chatMessages',msg)
        this.setState({
          chatMessages:[...this.state.chatMessages,msg]
        },()=>{
          // console.log('chatMessages',this.state.chatMessages)
        })
      })

    }

    submitChatMessage(){
    const chatMessage = {
      picture: require('../../assets/images/09.jpg'),
      comment:this.state.comment,
      senderId: this.state.name,
      userId: this.state.userId,
      name:this.state.name,
      date: new Date().toISOString().slice(0,10)
    }
    this.socket.emit("chat message", chatMessage)
    this.setState({
      chatMessage:''
    },()=>{
      this.textInput=''
    })
  }

    componentWillUnmount(){
        window.removeEventListener("scroll", this.scrollNavigation, true);
    }

    scrollNavigation = () => {
        var scrollup=document.documentElement.scrollTop;
        if(scrollup > this.state.pos)
        {
            this.setState({navClass : "nav-sticky", imglight : false});
        }
        else
        {
            this.setState({navClass : "", imglight : true});
        }
    };

    Loader = () => {
        return (
            <div id="preloader">
                <div id="status">
                    <div className="spinner">
                      Loading...
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (<Fragment>
                <Suspense fallback = {this.Loader()} >
                <div className="borderSolid" style={{
                  width:'100%',
                  height:50,
                  top:1,
                  zIndex:99,
                  position: 'absolute',
                  backgroundColor:'#D6DBDF'
                }}>
                  sssss
                </div>


                {/*<NavbarPage navItems={this.state.navItems} navClass={this.state.navClass} imglight={this.state.imglight} />*/}

                    {/* Importing Navbar */}

                    {/* Importing section */}
                    <Section/>

                    {/* Importing get in touch */}
                    {/* <Signup/>*/}

                    {/* Importing get in touch */}
                    {<Home/>}

                    {/* Importing get in touch */}

                    {/* Importing footer */}
                    <Footer/>
                </Suspense>

            </Fragment>
        );
    }
}

// export default Index1;

const mapStateToProps = (state, ownProps) => {
  const storeData = state
  console.log('xxxx',state)
  return {
    info: storeData.keyInfo
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onHandleQuery: (formData) => {
      dispatch(handleQuery(formData))
    },
    onLogoutFromView: () => {
      dispatch(logoutFromView())
    }
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MyIndex)
