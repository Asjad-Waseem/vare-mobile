import React, {Component, Fragment} from "react";

import Constants from "expo-constants";
import stylesB from "../assets/styles";
import Icon from "react-native-vector-icons/FontAwesome5";
import UserAvatar from "react-user-avatar";

const fullWidth = Dimensions.get("window").width;

export default class QandAListMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: [],
      distNumber: 0,
      refreshing: false
    };
  }

  componentWillUnmount() {}

  componentDidMount() {
    // this.updateNotice();
  }

  handleRefresh() {}

  render() {
    const {
      data,
      status,
      district,
      candidates,
      meetingList,
      messageList
    } = this.props;
    const {distNumber} = this.state;
    const dataLength = data.length;

    // console.log('district',status,district,distNumber)
    const countInfo = district ? district : distNumber;

    const Tag = ({colorPill, title, myIcon, item}) => {
      const statusState = status && title && status[title];

      return (
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              `Remove question "${item["title"]}"`,
              `${item["value"] ? item["value"] : ""}`,
              [
                {
                  text: "Remove",
                  style: "cancel",
                  onPress: () => {
                    const {data} = this.props;
                    const newList = data.filter(rep => {
                      return rep["value"] != item["value"];
                    });
                    this.props.updateGroupContact(newList);
                  }
                },
                {
                  text: "Cancel",
                  style: "cancel"
                }
              ]
            );
          }}
        >
          <View
            style={{
              backgroundColor: statusState ? "#87CEFA" : "rgba(0,0,0,.10)",
              // height: 35,
              borderColor: "white",
              borderWidth: 2,
              marginLeft: 3,
              // width: name && name.length > 15 ? name.length*10 : 150,
              // padding: 5,
              // paddingLeft: 10,
              paddingRight: 10,
              borderRadius: 20,
              alignItems: "center",
              marginTop: 10,

              marginBottom: 10,
              // marginRight: 6,
              flexDirection: "row"
            }}
          >
            <i
              style={{
                color: "gray"
              }}
              className={"fas fa-2x fa-times-circle"}
            />
            <Text
              style={{
                paddingLeft: 10,
                paddingRight: 10,
                padding: 5,
                fontWeight: "bold",
                marginTop: 4,
                color: "gray",
                fontSize: 16
              }}
            >
              {title && title.charAt(0).toUpperCase() + title.slice(1)}
            </Text>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View
        style={{
          width: fullWidth,
          // backgroundColor: "#f2f3f5",
          paddingLeft: 5
        }}
      >
        {data && dataLength > 0 && data ? (
          <FlatList
            horizontal={true}
            data={data}
            renderItem={({item, index}) => {
              return (
                <View>
                  <Tag
                    key={index + "ssdewed"}
                    colorPill={""}
                    title={item["title"]}
                    item={item}
                  />
                </View>
              );
            }}
            keyExtractor={(item, index) => index + "sseskdsska"}
            refreshing={this.state.refreshing}
            onRefresh={this.handleRefresh.bind(this)}
          />
        ) : null}
      </View>
    );
  }
}
