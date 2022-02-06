import React, {Component, Fragment, useEffect, useRef, useState} from "react";

import {Colxx, Separator} from "../../mycomponents/common/CustomBootstrap";
import {Row, Col, Card, CardBody} from "reactstrap";

import io from "socket.io-client";
import Peer from "simple-peer";
import styled from "styled-components";
import ScrollMenu from "react-horizontal-scrolling-menu";
import VideoControls from "./VideoControls";
import LiveChats from "./LiveChats";
import addDefaultSrc from "./addDefaultSrc";
import ReactPlayer from "react-player";

import FlatList from "flatlist-react";

export default class ScrollMenuPills extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      distNumber: 0,
      refreshing: false
    };
  }

  componentWillUnmount() {}

  componentDidMount() {}

  handleRefresh() {}

  render() {
    const {data, status, searchspanLength, district, candidates} = this.props;
    const {distNumber} = this.state;
    const dataLength = data.length;

    // console.log('district',status,district,distNumber)
    const countInfo = district ? district : distNumber;

    const Tag = ({colorPill, info}) => {
      const statusState = status && info && status[info];
      // && status.includes(info)

      return (
        <div
          style={{
            cursor: "pointer"
          }}
          onClick={() => {
            this.props.filterAction(info);
          }}
        >
          <div
            style={{
              backgroundColor: statusState ? "#87CEFA" : "rgba(0,0,0,.70)",
              height: 35,
              borderColor: "white",
              borderWidth: 2,
              marginLeft: 1,
              // width: info && info.length > 15 ? info.length*10 : 150,
              padding: 5,
              borderRadius: 20,
              alignItems: "center",
              marginTop: 10,
              cursor: "pointer"
              // marginRight: 6
            }}
          >
            <span
              style={{
                paddingLeft: 10,
                paddingRight: 10,
                fontWeight: "bold",
                marginTop: 4,
                color: "white",
                fontSize: 11
              }}
            >
              {info.toUpperCase()}
            </span>
          </div>
        </div>
      );
    };

    const Step = ({colorPill, info}) => {
      return (
        <div
          style={{
            flexDirection: "row",
            backgroundColor: "#87CEFA",
            height: 30,
            width: 210,
            padding: 5,
            borderRadius: 20,
            alignItems: "center",
            marginTop: 20,
            marginLeft: 10,
            marginRight: 6
          }}
        >
          <div
            style={{
              zIndex: 9,
              position: "absolute",
              left: 0,
              height: 30,
              width: 30,
              borderRadius: 25,
              backgroundColor: "gray"
            }}
            onClick={() => {
              countInfo > 1 &&
                this.setState({distNumber: countInfo - 1}, () => {
                  this.props.handleDistrict(countInfo - 1);
                });
            }}
          >
            <i className={"fas fa-minus-circle"} size={30} />
          </div>

          <div
            style={{
              alignItems: "center",
              width: "100%"
            }}
          >
            <span
              style={{
                color: "gray",
                fontSize: 14
              }}
            >
              {`District#: `}
              <span
                style={{
                  color: "gray",
                  fontWeight: "bold",
                  fontSize: 18
                }}
              >
                {countInfo}
              </span>
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              right: 0,
              // justifyContent:'space-between',
              height: 30,
              width: 30,
              borderRadius: 25,
              backgroundColor: "gray"
            }}
            onClick={() => {
              this.setState({distNumber: countInfo + 1}, () => {
                this.props.handleDistrict(countInfo + 1);
              });
            }}
          >
            <i className={"fas fa-plus-circle"} size={30} />
          </div>
        </div>
      );
    };

    return (
      <div
        style={{
          display: "flex",
          // flexWrap: "wrap",
          width: "100%",
          paddingLeft: 5,
          height: 70,
          overflowY: "auto"
        }}
      >
        {data && dataLength > 0 && data
          ? data.map((item, index) => {
              return (
                <div
                  style={{
                    padding: 5
                  }}
                  key={"frrvvrde" + index}
                >
                  {item.info == "district" &&
                  status["challenger"] &&
                  candidates.length > 0 ? (
                    <Step
                      key={index + "sdewed"}
                      colorPill={""}
                      info={item.info}
                    />
                  ) : item.info !== "district" ? (
                    <Tag
                      key={index + "ssdewed"}
                      colorPill={""}
                      info={item.info}
                    />
                  ) : (
                    <div></div>
                  )}
                </div>
              );
            })
          : null}
      </div>
    );
  }
}
