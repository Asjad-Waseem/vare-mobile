// Change YOUR_API_KEY_HERE to your apiKey
import RESTCall from "./restApi";
import AppStore from "./services/datastore";
import * as Contacts from "expo-contacts";
import USStates from "../assets/data/states";
import moment from "moment";

const request = "";

// https://varepoll.herokuapp.com/
import ApolloClient, {InMemoryCache, StoreReader} from "apollo-boost";
import gql from "graphql-tag";

// const uri = env.api;
const EventId = 1;
let connection = true;
let globalToken = null;
let apolloClient = null;

export async function myClient() {
  let config = {
    // uri: "http://localhost:4000/",
    uri: "https://varepoll.herokuapp.com/",
    cache: new InMemoryCache()
  };
  return new ApolloClient(config);
}

export async function clearClient() {
  if (apolloClient) {
    apolloClient = null;
  }
  if (globalToken) {
    globalToken = null;
  }
}

export async function myQuery(q) {
  // if (connection) {
  let client = await myClient();
  let {data} = await client.query({
    query: gql`
      ${q}
    `
  });
  return data;
  // }
}

export async function mutation(m, variable) {
  if (connection) {
    let client = await myClient();
    let {data} = await client.mutate({
      mutation: gql`
        ${m}
      `,
      variables: variable
    });
    return data;
  }
}

export async function getLocalElectionInfo({offset, myState}) {
  let query = `{
    vareElectionByState(offset:${offset},myState:"${myState}") {
     length
     cursor
     hasMore
     vareElectionByState {
       id
        key_id
        name
        installId
        electionDay
        create_date
        election_date
        election_district
        election_notes
        election_party
        election_state
        election_type_full
        election_type_id
        election_year
        google_id
        ocdDivisionId
        office_sought
        pollingDetails
        pollingLocations {
            website
            office
            email
            address
            city
            line1
            name
            state
            zip
            emailAddress
            heldBy
            officePhoneNumber
          }
        }
     }
  }`;
  let reply = await myQuery(query);

  const result =
    reply &&
    reply.vareElectionByState &&
    reply.vareElectionByState.vareElectionByState;
  // console.log('result',result)
  return result;
}

export async function getPolicy({offset, recordSize, search}) {
  const offetVal = offset ? offset : 0;
  const searchText = search ? search : "";
  // console.log("ssss", recordSize, offset, searchText);

  let query = `{
    vareCongressBills(offset:${offetVal},search:"${searchText}",recordSize:${recordSize}) {
      keywords
      length
      cursor
      hasMore
      vareCongressBills {
        id
         bill_id
         bill_type
         bill_uri
         title
         introduced_date
         sponsor_title
         sponsor_id
         sponsor_name
         sponsor_state
         sponsor_party
         summary
         latest_major_action_date
         active
         chamber
         committee
         committees
         summary_short
         member_id
         description
         time
         position
         result
         latest_action
         short_title
         enacted
         vetoed
         video
      }
    }
  }`;
  let reply = await myQuery(query);

  const info = reply && reply.vareCongressBills && reply.vareCongressBills;

  const result = info.vareCongressBills;

  const length = info.length;

  const cursor = info.cursor;

  const keywords = info.keywords;

  return {
    data: result,
    cursor: cursor,
    length: length,
    keywords: keywords
  };
}

export async function getMyStateRepresentatives({offset, address, state}) {
  // return [];
  // console.log("addressvvv", address, state);
  const offetVal = offset ? offset : 0;
  let myState = state ? state : "";
  let query = `{
    vareLocalReps(address:"${address}",state:"${myState}",offset:${offetVal}) {
      length
      cursor
      hasMore
      vareLocalReps {
        id
        member_id
         address
         city
         state
         zip
         party
         role
         name
         fullName
         title
         phones
         urls
         photoUrl
         emails
         position
         divisionId
         bill_id
         congress
         typename
         chamber
         picture
         phone
         url
      }
    }
  }`;
  let reply = await myQuery(query);
  const result =
    reply && reply.vareLocalReps && reply.vareLocalReps.vareLocalReps;
  // console.log("xxvareLocalReps", result);
  return result;
}

export async function getStateStateRepresentatives({
  offset,
  address,
  recordSize,
  state
}) {
  const myState = state ? state : "TX";
  let query = `{
    vareStateStateReps(address:"${address}",offset:${offset},recordSize:${recordSize},state:"${myState}") {
        length
        cursor
        hasMore
        vareStateStateReps {
          id
          member_id
          district
          address
          city
          state
          zip
          party
          role
          name
          fullName
          title
          phones
          urls
          photoUrl
          emails
          position
          divisionId
          bill_id
          congress
          typename
          chamber
          picture
          phone
          url
          email
          committees
          office
          facebook_account
          youtube_account
          rank_in_party
        }
     }
  }`;
  let reply = await myQuery(query);
  const result =
    reply &&
    reply.vareStateStateReps &&
    reply.vareStateStateReps.vareStateStateReps;

  const length =
    reply && reply.vareStateStateReps && reply.vareStateStateReps.length;

  // console.log("xxvareLocalReps", length);
  return {
    result,
    length
  };
}

export async function getMyStateCandidates({
  offset,
  address,
  state,
  recordSize
}) {
  // return [];
  // console.log("addressvvv", address, state);
  const myAddress = address ? address : "";
  const offetVal = offset ? offset : 0;
  const myState = state ? state : "TX";
  let query = `{
    vareCandidates(address:"${myAddress}",myState:"${myState}",offset:${offset},recordSize:${recordSize}) {
          length
          keywords
          cursor
          hasMore
          vareCandidates {
            id
            member_id
            fullName
            congress
            chamber
            name
            first_name
            last_name
            date_of_birth
            gender
            party
            total_votes
            missed_votes
            state
            missed_votes_pct
            votes_with_party_pct
            votes_against_party_pct
            election
            challenger
            district
            url
            phone
            email
            committees
            office
            facebook_account
            youtube_account
            rank_in_party
          }
        }
  }`;
  let reply = await myQuery(query);
  const result =
    reply && reply.vareCandidates && reply.vareCandidates.vareCandidates;
  // console.log("xxvareLocalReps", reply);
  const lengthInfo =
    reply && reply.vareCandidates && reply.vareCandidates.length;

  return {
    result,
    lengthInfo
  };
}

export async function getMembersByState({offset, address, state}) {
  const myState = state ? state : "";
  let query = `{
    vareMembersByState(address:"${address}",state:"${myState}",offset:${0}) {
      length
      cursor
      hasMore
      vareMembersByState {
        id
         member_id
         congress
         chamber
         name
         first_name
         last_name
         date_of_birth
         gender
         party
         total_votes
         missed_votes
         state
         missed_votes_pct
         votes_with_party_pct
         votes_against_party_pct
         election
         challenger
         district
          url
          phone
          email
          committees
          office
          facebook_account
          youtube_account
          rank_in_party
      }
    }
  }`;
  let reply = await myQuery(query);
  // console.log('xxvareLocalReps',reply)
  const result =
    reply &&
    reply.vareMembersByState &&
    reply.vareMembersByState.vareMembersByState;

  return result;
}

export async function getMembers({offset, type, search, state}) {
  //alert(3)
  const offetVal = offset ? offset : 0;
  const searchText = search ? search : "";
  const setType = type ? type : "both";
  const myState = state ? state : "";

  let query = `{
    vareMembers(type:"${setType}",offset:${offetVal},search:"${searchText}",myState:"${myState}") {
      offset
      keywords
      length
      cursor
      hasMore
      vareMembers {
        id
        member_id
        congress
        chamber
        name
        first_name
        last_name
        date_of_birth
        gender
        party
        total_votes
        missed_votes
        state
        missed_votes_pct
        votes_with_party_pct
        votes_against_party_pct
        election
        challenger
        picture
        url
        phone
        email
        committees
        office
        facebook_account
        youtube_account
        rank_in_party
      }
    }
  }`;
  let reply = await myQuery(query);

  // console.log('vareMembers',reply)
  const result = reply && reply.vareMembers && reply.vareMembers.vareMembers;

  const keywords = reply && reply.vareMembers && reply.vareMembers.keywords;

  const offest = reply && reply.vareMembers && reply.vareMembers.offest;
  // console.log('vareMembers',result)
  return {
    offest: offest,
    keywords: keywords,
    data: result
  };
}

export async function getLocalCandidates({offset, search, state}) {
  const searchText = search ? search : "";
  const myState = state ? state : "";
  let query = `{
    vareCandidates(offset:${offset},search:"${searchText}",myState:"${myState}") {
     offset
     keywords
     length
     cursor
     hasMore
     vareCandidates {
       id
       member_id
       congress
       chamber
       name
       first_name
       last_name
       date_of_birth
       gender
       party
       total_votes
       missed_votes
       state
       missed_votes_pct
       votes_with_party_pct
       votes_against_party_pct
       election
       challenger
       district
       district
      url
      phone
      email
      committees
      office
      facebook_account
      youtube_account
      rank_in_party
     }
   }
  }`;
  let reply = await myQuery(query);
  // console.log('xxxreply',reply)

  const result =
    reply && reply.vareCandidates && reply.vareCandidates.vareCandidates;
  // console.log('vareCandidates',result)
  const keywords =
    reply && reply.vareCandidates && reply.vareCandidates.keywords;

  return {
    keywords: keywords,
    data: result
  };
}

export async function getCovidTestLocations({offset, search, state}) {
  const searchText = search ? search : "";
  const myState = state ? state : "";
  let query = `{
    vareCovidLocations(offset:${offset},myState:"${myState}") {
      offset
      length
      cursor
      hasMore
     vareCovidLocations {
        name
        address
        phone
        schedule
        url
        appointment
        county
     }
   }
  }`;
  let reply = await myQuery(query);
  // console.log('xxxreply',reply)

  const result =
    reply &&
    reply.vareCovidLocations &&
    reply.vareCovidLocations.vareCovidLocations;
  // console.log('vareCovidLocations',result

  return {
    data: result
  };
}

export async function getPresidentialCongressBills({offset, id}) {
  let query = `{
    varePresidentialBills(offset:${offset},id:"${id}") {
      offset
      length
      cursor
      hasMore
      varePresidentialBills {
         id
         role
         urls
         member_id
         description
         introduced_date
         pdf_url
         html_url
         time
         html_url
         position
         result
         title
         bill_id
      }
    }
  }`;
  let reply = await myQuery(query);

  const info =
    reply && reply.varePresidentialBills && reply.varePresidentialBills;

  const result =
    reply &&
    reply.varePresidentialBills &&
    reply.varePresidentialBills.varePresidentialBills;

  const cursor =
    reply && reply.varePresidentialBills && reply.varePresidentialBills.cursor
      ? reply.varePresidentialBills.cursor
      : "";

  const length =
    reply && reply.varePresidentialBills && reply.varePresidentialBills.length
      ? reply.varePresidentialBills.length
      : 1;

  const keywords =
    reply && reply.varePresidentialBills && reply.varePresidentialBills.keywords
      ? reply.varePresidentialBills.keywords
      : "";

  // console.log('varePresidentialBills',result)
  return {
    data: result,
    cursor: cursor,
    length: length,
    keywords: keywords
  };
}

export async function getPresidentialBills({offset, id}) {
  let query = `{
    varePresidentialBills(offset:${offset},id:"${id}") {
      offset
      length
      cursor
      hasMore
      varePresidentialBills {
         id
         role
         urls
         member_id
         description
         introduced_date
         pdf_url
         html_url
         time
         html_url
         position
         result
         title
         bill_id
      }
    }
  }`;
  let reply = await myQuery(query);

  const result =
    reply &&
    reply.varePresidentialBills &&
    reply.varePresidentialBills.varePresidentialBills;

  // console.log('varePresidentialBills',result)
  return result;
}

export async function getExecutiveOrders({offset}) {
  let query = `{
    vareExecutiveOrders(offset:${offset}) {
      offset
      length
      cursor
      hasMore
      vareExecutiveOrders {
         id
         role
         urls
         member_id
         description
         introduced_date
         pdf_url
         html_url
         time
         html_url
         position
         result
         title
         bill_id
      }
    }
  }`;
  let reply = await myQuery(query);

  const result =
    reply &&
    reply.vareExecutiveOrders &&
    reply.vareExecutiveOrders.vareExecutiveOrders;

  // console.log('varePresidentialBills',result)
  return result;
}

export async function getUserProfile({offset}) {
  let query = `{
    vareUserProfile(offset:${offset}) {
      offset
      length
      cursor
      hasMore
      vareUserProfile {
         id
         address,
         district,
         email,
         user_id,
         fullName,
         sex,
         age,
         race,
         party,
         phone,
         lat,
         lng,
         ambassador,
         facebook,
         instagram
      }
    }
  }`;
  let reply = await myQuery(query);

  const result =
    reply && reply.vareUserProfile && reply.vareUserProfile.vareUserProfile;

  // console.log('varePresidentialBills',result)
  return result;
}

export async function getMemberVoteRecord({id, offset, search}) {
  // console.log("id", id);

  const setId = id ? id : "";
  const setOffset = offset ? offset : 0;
  const setSearch = search ? search : 0;

  let query = `{
    vareMemberVotes(id: "${setId}",offset:${setOffset},search:"${setSearch}",pageSize:500) {
      bio {
         id
         member_id
         congress
         chamber
         name
         first_name
         last_name
         date_of_birth
         gender
         party
         total_votes
         missed_votes
         state
         missed_votes_pct
         votes_with_party_pct
         votes_against_party_pct
         election
         challenger
       }
     length
     cursor
     hasMore
     vareMemberVotes {
       id
       member_id
       description
       introduced_date
       time
       position
       result
       bill_id
       latest_action
       sponsor_id
       title
       committees
     }
   }
  }`;
  let reply = await myQuery(query);

  const result =
    reply && reply.vareMemberVotes && reply.vareMemberVotes.vareMemberVotes;

  const bio = reply && reply.vareMemberVotes && reply.vareMemberVotes.bio;
  // console.log("vareMemberVotes", result);
  return {
    bio: bio,
    data: result
  };
}

export async function getStateMemberVoteRecord({
  id,
  offset,
  search,
  state,
  recordSize
}) {
  const myRecordSize = recordSize ? recordSize : 100;
  const myState = state ? state : "";
  const setId = id ? id : "";
  const setOffset = offset ? offset : 0;
  const setSearch = search ? search : 0;
  // console.log("state record", setId, myState);
  let query = `{
    vareStateMemberVotes(id: "${setId}",offset:${setOffset},search:"${setSearch}",recordSize:${myRecordSize},myState:"${myState}",pageSize:500) {
      bio {
         id
         member_id
         congress
         chamber
         name
         first_name
         last_name
         date_of_birth
         gender
         party
         total_votes
         missed_votes
         state
         missed_votes_pct
         votes_with_party_pct
         votes_against_party_pct
         election
         challenger
       }
     length
     cursor
     hasMore
     vareStateMemberVotes {
       id
       member_id
       description
       introduced_date
       time
       position
       result
       bill_id
       latest_action
       sponsor_id
       title
       committees
       website
       urls
     }
   }
  }`;
  let reply = await myQuery(query);

  const result =
    reply &&
    reply.vareStateMemberVotes &&
    reply.vareStateMemberVotes.vareStateMemberVotes;

  const bio =
    reply && reply.vareStateMemberVotes && reply.vareStateMemberVotes.bio;

  const lengthy =
    reply && reply.vareStateMemberVotes && reply.vareStateMemberVotes.length;
  // console.log("vareMemberVotes", result);
  return {
    bio: bio,
    data: result,
    length: lengthy
  };
}

export async function getVareUserVotes(offset) {
  let query = `{
    vareUserVotes(offset:${offset}) {
      cursor
      hasMore
      vareUserVotes {
        id
        user_id
        item_id
        vote
        Timestamp
      }
    }
  }`;
  let reply = await myQuery(query);

  const result =
    reply && reply.vareUserVotes && reply.vareUserVotes.vareUserVotes;

  // console.log('vareUserVotes',result)
  return result;
}

export async function getMyCandidates() {
  // var timeit = new TimeIt();
  let query = `{
            loads {
                cursor
                hasMore
                loads {
                  id
                  Loads
                  Units
                  Timestamp
                  Driver
                  RateCon
                  EstimatedPay
                  CompanyName
                  ContactPhone
                  ContactName
                  Miles
                  FuelRate
                  MileRate
                  FuelRatePerMile
                  EstimatedFuelCost
                  Pickup
                  Delivery
                  PickupDate
                  DeliveryDate
                  Pieces
                  Weight
                  LoadedMiles
                  UnloadedMiles
                  PayMethod
                  Tendered
                  Loaded
                  InRoute
                  Delivered
                  Factored
                  Paid
                  ActualMiles
                  DriverName
                  EstimatedFuel
                }
              }
          }`;
  let result = await myQuery(query);
  // timeit.end("loadList");
  return result;
}

export async function getVareLikeMindVoters({offset, search, user_id}) {
  const searchText = search ? search : "";
  const id = user_id ? user_id : "e18ec5c9fdbd";
  let query = `{
    vareLikeMindVoters(offset:${offset},id:"${id}",search:"${searchText}") {
    length
    cursor
    hasMore
    vareLikeMindVoters {
      id
      user_id
      likeminds
    }
  }
  }`;
  let reply = await myQuery(query);
  // console.log('xxxreply',reply)

  const result =
    reply &&
    reply.vareLikeMindVoters &&
    reply.vareLikeMindVoters.vareLikeMindVoters;
  const modifyResult =
    result &&
    result[0] &&
    result[0].likeminds &&
    JSON.parse(result[0].likeminds);
  if (modifyResult) result[0].likeminds = modifyResult;
  // console.log("vareLikeMindVoters", result);

  return {
    data: modifyResult
  };
}

export async function getPresidentialCandidate() {
  const executiveCandidate = {};
  executiveCandidate["P60012143"] = {
    challenger: "C",
    chamber: "Presidential",
    congress: "",
    date_of_birth: "",
    election: "President",
    first_name: "JOE R",
    gender: "M",
    id: 551,
    last_name: "BIDEN",
    member_id: "P60012143", //"DE - D"
    missed_votes: null,
    name: "BIDEN, JOE R",
    party: "D",
    state: "US",
    total_votes: null,
    watch: true,
    picture: "https://vareapp.com/images/pics/biden.jpg"
  };

  executiveCandidate["P80001571"] = {
    challenger: "I",
    chamber: "Presidential",
    congress: "",
    date_of_birth: "",
    election: "President",
    first_name: "Donald",
    gender: "M",
    id: 551,
    last_name: "Trump",
    member_id: "P80001571",
    missed_votes: null,
    name: "Donald Trump",
    party: "R",
    state: "US",
    total_votes: null,
    watch: true,
    picture: "https://vareapp.com/images/pics/trump.jpg"
  };

  executiveCandidate["H001075"] = {
    challenger: "C",
    chamber: "Vice Presidential",
    congress: "",
    date_of_birth: "",
    election: "Vice President",
    first_name: "Kamala",
    gender: "F",
    id: 551,
    last_name: "Harris",
    member_id: "H001075", //"DE - D"
    missed_votes: 266,
    missed_votes_pct: 48.28,
    name: "Kamala Harris",
    party: "D",
    picture: "https://theunitedstates.io/images/congress/225x275/H001075.jpg",
    watch: true,
    state: "CA",
    total_votes: 551,
    votes_against_party_pct: 22.91,
    votes_with_party_pct: 77.1
  };
  return getNewContestants(executiveCandidate);
  // return votingRecord;
}

export async function getNewContestants(executiveCandidate) {
  const offset = 0;
  let query = `{
        vareContestants(offset:${offset}) {
          offset
          length
          cursor
          hasMore
          vareContestants {
            id
            member_id
            congress
            chamber
            name
            first_name
            last_name
            date_of_birth
            gender
            party
            total_votes
            missed_votes
            state
            missed_votes_pct
            votes_with_party_pct
            votes_against_party_pct
            election
            challenger
            picture
            url
            phone
            email
            committees
            office
            facebook_account
            youtube_account
            rank_in_party
            active
            message {
             type
             link
           }
          }
        }
      }`;
  let reply = await myQuery(query);

  const result =
    reply && reply.vareContestants && reply.vareContestants.vareContestants;

  result &&
    result.length > 0 &&
    result.map(res => {
      executiveCandidate[res.id] = res;
    });

  // AppStore.remove('unWatch')
  const unWatch = await AppStore.get("unWatch");
  if (unWatch && unWatch.length > 0) {
    unWatch.map(res => {
      delete executiveCandidate[res];
    });
  }

  return executiveCandidate;
}

export async function getDebateDetails() {
  const offset = 0;
  let query = `{
        vareDebates(offset:${offset}) {
          offset
          length
          cursor
          hasMore
          vareDebates {
            bill_id
            title
            label
            link
      			candidates {
              id
              name
              school
              medialink
              picture
              votes
           }
         }
        }
      }`;
  let reply = await myQuery(query);

  const result = reply && reply.vareDebates && reply.vareDebates.vareDebates;

  // console.log('result',result)
  return result;
}

// export async function getPresidentialBills(candidateId) {
//   const myWatch = await AppStore.get('myWatch')
//
//
//   if(candidateId === 'P60012143'){
//         const formData = {
//            request:'get',
//            resource: 'vare_bills_joe'
//         }
//       const existingData = await RESTCall.axiosQuery(formData) //Check if data already exist
//       .then((results, index) => {
//         // console.log('biiidresults',results)
//         return results && results.map(result => {
//             let resultObject = {
//               "member_id": result.member_id,
//               "description": result.description+' | '+result.title,
//               "introduced_date": result.introduced_date,
//               "time": result.time,
//               "position": result.position,
//               "result": result.result,
//               "bill_id": result.bill_id,
//               "latest_action": result.latest_action,
//               "sponsor_id": result.bill_id,
//               // "title": result.title && result.title,
//               "title": result.description+' | '+result.title,
//               "committees":result.committees
//             }
//             return resultObject
//           })
//         })
//         return existingData;
//
//   } else if(candidateId === 'P80001571'){
//         const formData = {
//            request:'get',
//            resource: 'vare_exec'
//         }
//         const existingData = await RESTCall.axiosQuery(formData) //Check if data already exist
//         .then((results, index) => {
//           // console.log('resultsdonald',results)
//           return results && results.map(result => {
//               let resultObject = {
//                 "member_id": candidateId,
//                 "description": result.title+' | citation: '+result.citation+' | executive_order_number: '+result.executive_order_number,
//                 "introduced_date": result.signing_date,
//                 "time": result.signing_date,
//                 "position": 'Yes',
//                 "result": result.result,
//                 "bill_id": result.executive_order_number,
//                 "latest_action": result.bill && result.bill.latest_action,
//                 "sponsor_id": result.document_number,
//                 "title": result.title,
//                 "committees":result.subtype
//               }
//               return resultObject
//             })
//           })
//           return existingData;
//       }
// }

// export async function getPresidentialCandidate() {
//
//     const votingRecord = {}
//           votingRecord['P60012143'] = {
//             challenger:"C",
//             chamber: "Presidential",
//             congress: "",
//             date_of_birth: "",
//             election: "President",
//             first_name: "JOE R",
//             gender: "M",
//             id: 551,
//             last_name: "BIDEN",
//             member_id: "P60012143",//"DE - D"
//             missed_votes: null,
//             name: "BIDEN, JOE R",
//             party: "D",
//             state: "US",
//             total_votes: null,
//             watch: true
//         }
//
//         votingRecord['P80001571'] = {
//           challenger:"I",
//           chamber: "Presidential",
//           congress: "",
//           date_of_birth: "",
//           election: "President",
//           first_name: "Donald",
//           gender: "M",
//           id: 551,
//           last_name: "Trump",
//           member_id: "P80001571",
//           missed_votes: null,
//           name: "Donald Trump",
//           party: "R",
//           state: "US",
//           total_votes: null,
//           watch: true
//       }
//
//        return votingRecord;
//
//   }

export async function getElections() {
  const url =
    "https://www.googleapis.com/civicinfo/v2/elections?key=AIzaSyACYhltJ6rt1RRKcrgCKCobmKrLE-qT5L4";
  let result = await fetch(url).then(response => {
    return response.json();
  });

  // const formData = {
  //    request:'get',
  //    resource: 'vare_elections'
  // }
  // const existingData = await RESTCall.axiosQuery(formData) //Check if data already exist
  //
  // const existingDataKeys = existingData
  // && existingData.length > 0
  // ? existingData.map(rep => {
  //   return rep.key_id
  // })
  // : null

  //Todo  filter records and add to the database and return to parent component to save to store
  const pollingData = await getPollingLocation(result.elections).then(rep => {
    const details = rep.map(results => {
      // console.log('resultsxx',results)
      const pollingLocations = results.pollingLocations
        ? results.pollingLocations
        : [];
      const contests = results.contests ? results.contests : [];
      const name =
        results.election && results.election.name ? results.election.name : "";
      const electioId =
        results.election && results.election.id ? results.election.id : "";
      const electionDetails = results.state.map(res => {
        let electionObject = {};
        electionObject["heldBy"] =
          res.electionAdministrationBody && res.electionAdministrationBody.name
            ? res.electionAdministrationBody.name
            : "";
        electionObject["county"] =
          res.local_jurisdiction && res.local_jurisdiction.name
            ? res.local_jurisdiction.name
            : "";

        const electionOfficials =
          res.local_jurisdiction &&
          res.local_jurisdiction.electionAdministrationBody &&
          res.local_jurisdiction.electionAdministrationBody.electionOfficials &&
          res.local_jurisdiction.electionAdministrationBody.electionOfficials[0]
            ? res.local_jurisdiction.electionAdministrationBody
                .electionOfficials[0]
            : "";

        electionObject["emailAddress"] =
          electionOfficials && electionOfficials.emailAddress
            ? electionOfficials.emailAddress
            : "";

        electionObject["officePhoneNumber"] =
          electionOfficials && electionOfficials.officePhoneNumber
            ? electionOfficials.officePhoneNumber
            : "";

        const physicalAddress =
          res.local_jurisdiction &&
          res.local_jurisdiction.electionAdministrationBody &&
          res.local_jurisdiction.electionAdministrationBody.physicalAddress
            ? res.local_jurisdiction.electionAdministrationBody.physicalAddress
            : "";
        electionObject["address"] =
          physicalAddress.line1 +
          " " +
          physicalAddress.city +
          " " +
          physicalAddress.state +
          " " +
          physicalAddress.zip;
        return electionObject;
      });
      return {
        name: name,
        key_id: electioId,
        electionDetails: electionDetails,
        pollingLocations: pollingLocations,
        contests: contests
      };
    });
    return details;
  });

  // if(result && result.elections && result.elections.length > 0){    // insert data to DB
  //    const data = result.elections;
  //    data.map(res => {
  //        res['key_id'] = res.id
  //        const formData = {
  //           request:'insert',
  //           query: res,
  //           resource: 'vare_elections',
  //        }
  //        if(existingDataKeys && existingDataKeys.includes(res.id)==false)
  //          insertDatabase(formData)
  //    })
  //  }

  const electInfo =
    result.elections && result.elections.length > 0 //if api data is empty then resent the stored data
      ? result.elections
      : [];

  //mutate elections data to add polling array from promise all
  pollingData &&
    electInfo.map(res => {
      const polls = pollingData.filter(rep => {
        return rep.key_id === res.key_id;
      });
      // console.log('polls',polls[0])
      res["contests"] = polls && polls[0] ? polls[0].contests : "";
      res["electionDetails"] =
        polls && polls[0] ? polls[0].electionDetails : "";
      res["pollingLocations"] =
        polls && polls[0] ? polls[0].pollingLocations : "";
      return res;
    });

  // console.log('addResults',result.elections)

  return result.elections && result.elections.length > 0 //if api data is empty then resent the stored data
    ? result.elections
    : [];
}

//https://developers.google.com/civic-information/docs/v2/elections/voterInfoQuery?apix=true&apix_params=%7B%22address%22%3A%2211509%20North%20Lamar%20blvd%20Austin%2078753%22%7D#try-it
export async function getPollingInfo(address) {
  const url = `https://www.googleapis.com/civicinfo/v2/voterinfo?electionId=${4989}&address=${address}&key=AIzaSyACYhltJ6rt1RRKcrgCKCobmKrLE-qT5L4`;
  let result = await fetch(url).then(response => response.json());
  // console.log('resultxx3',address,result)
  return result && result.error ? result.error.message : result;
}

//https://developers.google.com/civic-information/docs/v2/elections/voterInfoQuery?apix=true&apix_params=%7B%22address%22%3A%2211509%20North%20Lamar%20blvd%20Austin%2078753%22%7D#try-it
export async function getPollingLocation(records) {
  const myInfo = await AppStore.get("myInfo");
  if (myInfo && myInfo.address) {
    const result =
      records.length > 0 &&
      Promise.all(
        records.map(res => {
          const url = `https://www.googleapis.com/civicinfo/v2/voterinfo?electionId=${res.id}&address=${myInfo.address}&key=AIzaSyACYhltJ6rt1RRKcrgCKCobmKrLE-qT5L4`;
          return fetch(url).then(response => {
            return response.json();
          });
        })
      );
    return result;
    // console.log('resultxx4',records,result)
  } else {
    return false;
  }
  // console.log('resultxx5',address,result)
}

export async function getCommittees({congress, chamber}) {
  const policyurl = `https://api.propublica.org/congress/v1/${
    congress ? congress : 115
  }/${chamber ? chamber : "senate"}/committees.json`;
  // const policyurl =  `https://api.propublica.org/congress/v1/115/senate/committees.json`
  // const policyurl = 'https://api.propublica.org/congress/v1/115/senate/committees.json'
  return await fetch(policyurl, {
    method: "GET",
    headers: {
      "X-API-Key": "xONltDDnzC92LWPmI53LcPBdtMhhLsckfrkSHqQQ"
    }
  })
    .then(resp => {
      return resp.json();
    })
    .catch(err => {
      return err;
    });
}

// export async function getLocalGovInfo({page}) { //Data needs more filtering
//     let pageNumber = page ? page : 1
//     let limit = 100
//     let year = 2020
//     // const url = `https://api.open.fec.gov/v1/candidates/?sort=name&sort_nulls_last=false&sort_hide_null=false&page=${pageNumber}&sort_null_only=false&api_key=TyHF6sThNWi1b8hKiYRDMeIcgHuqB0QdIXaUeoGz&per_page=${limit}`
//     const url = `https://api.open.fec.gov/v1/candidates/?sort=name&sort_nulls_last=false&sort_hide_null=false&election_year=${year}&page=${pageNumber}&sort_null_only=false&api_key=TyHF6sThNWi1b8hKiYRDMeIcgHuqB0QdIXaUeoGz&per_page=${limit}&year=${year}
//   `
//     let result = await fetch(url).then(response => response.json());
//     return result;
//   }

export async function getstateElectionOffice({page, myState, rep}) {
  let pageNumber = page ? page : 1;
  let limit = 100;
  let year = 2020;
  let url = "";

  if (myState && myState !== "") {
    url = `https://api.open.fec.gov/v1/state-election-office/?per_page=${limit}&sort_nulls_last=false&state=${myState}&api_key=TyHF6sThNWi1b8hKiYRDMeIcgHuqB0QdIXaUeoGz&sort_null_only=false&sort_hide_null=false&election_state=${myState}&year=${year}`;
  }

  let data = await fetch(url).then(response => response.json());
  const allElections = await Promise.all(
    data.results.map(result => {
      return result;
    })
  );

  const info =
    allElections &&
    allElections.length > 0 &&
    allElections.map(location => {
      // console.log('location',location)
      const result = {
        website: location.website_url1 ? location.website_url1 : "",
        office: location.office_name ? location.office_name : "",
        email: location.email ? location.email : "",
        address: location.address_line1 ? location.address_line1 : "",
        city: location.city ? location.city : "",
        line1: location.address_line1 ? location.address_line1 : "",
        name: location.office_name ? location.office_name : "",
        state: location.state ? location.state : "",
        zip: location.zip_code ? location.zip_code : "",
        emailAddress: location.email ? location.email : "",
        heldBy: location.state ? location.state : "",
        officePhoneNumber: location.primary_phone_number
          ? location.primary_phone_number
          : ""
      };
      return result;
    });

  rep["pollingLocations"] = info;
  return rep;
}

export async function getNews() {
  const newsurl =
    "https://newsapi.org/v2/top-headlines?country=us&apiKey=904fe7cb2cd4412593c3326ccc240c04";
  let result = await fetch(newsurl).then(response => response.json());
  return result.articles;
}

const billsOption = query => {
  // console.log('bills',query)
  const fullUrl = {
    recentBills: "members/L000287/bills/introduced.json",
    memberBills: `members/${query.memberId}/bills/votes.json`,
    specificBill: `${query.congress}/bills/${query.billId}.json`,
    upcomingBill: `bills/upcoming/${query.chamber}.json`
  };
  const billURL = fullUrl[query.requestType]
    ? fullUrl[query.requestType]
    : fullUrl.recentBills;
  return billURL;
};

//Policy
// export async function getPolicy(query) {
// console.log('query',query)
// const apiOptions = {
//   house: '116/house/members.json',
//   members: '116/senate/members.json',
//   bills: billsOption(query),
//   votes: 'house/votes/recent.json',
//   press: 'statements/latest.json',
//   committees: '116/senate/committees.json',
//   nominees: '116/nominees/confirmed.json',
//   records: `members/${query.memberId}/votes.json`
// }
//
// const policyurl = `https://api.propublica.org/congress/v1/${apiOptions[query.request] ? apiOptions[query.request] : '116/senate/members.json'}`;
// let result = await fetch(policyurl, {
//   method: "GET",
//   headers: {
//     "X-API-Key": "xONltDDnzC92LWPmI53LcPBdtMhhLsckfrkSHqQQ"
//   }
// })
// .then(resp => {
//   // console.log('respmmm',resp.json())
//   return resp.json()
// })
// .then(data => {
//   // console.log('resp2',data)
//     return data.results[0][
//       query.request == 'house' ? 'members'
//       : query.request == 'records' ? 'votes'
//       : query.request
//     ]
//
// }).catch(err => {
//   // console.log('err',err);
//   return null
// })
//
//
//  return result
// }

let allVals = [];
//---------------------all members

// export async function saveCandidates({
//   info,
//   pageNumber
//   }){
//   if(info && info.length > 0){    // insert data to DB
//      info.map(res => {
//
//          res['page'] = pageNumber
//          const formData = {
//             request:'insert',
//             query: res,
//             resource: 'vare_candidates'
//             // check:['member_id']
//          }
//          // if(existingDataKeys && existingDataKeys.includes(pageNumber)==false){
//            // insertDatabase(formData).then(rep => {
//            //   console.log('xxxxxzz',rep)
//            // })
//          // }
//      })
//    }
// }

//---------------------form VARE Save DB
export async function getCandidates(state) {
  const formData = {
    request: "get",
    resource: "vare_candidates"
  };
  const allResult = await RESTCall.axiosQuery(formData).then(
    (results, index) => {
      return (
        results &&
        Promise.all(
          results.map(result => {
            let rep = {
              member_id: result.member_id ? result.member_id : "",
              congress: 116, //add from request
              chamber: result.chamber ? result.chamber : "",
              name: result.first_name + " " + result.last_name,
              first_name: result.first_name,
              last_name: result.last_name,
              date_of_birth: result.date_of_birth,
              gender: result.gender,
              party: result.party,
              // "total_votes": result.total_votes,
              // "missed_votes": result.missed_votes,
              state: result.stat ? result.stat : "",
              approved: result.approved ? result.approved : false,
              // "missed_votes_pct": result.missed_votes_pct,
              // "votes_with_party_pct": result.votes_with_party_pct,
              // "votes_against_party_pct": result.votes_against_party_pct,
              election: "Congressional"
            };
            return rep;
          })
        )
      );
    }
  );

  return (
    allResult &&
    allResult.data &&
    allResult.data.length > 0 &&
    allResult.data.filter(res => {
      return res.approved && res.approved == 1;
    })
  );
}

// export async function getMemberVoteRecord (id){
//   let query = {
//     request: 'records',
//     memberId:id,
//     type:'',
//     congress:'',
//     billId:'',
//     chamber:''
//   }
//   const arrayRep = await getPolicy(query)
//    .then((results, index) => {
//      return results && results.map(result => {
//        let resultObject = {
//          "member_id": result.member_id,
//          "description": result.description,
//          "introduced_date": result.date,
//          "time": result.time,
//          "position": result.position,
//          "result": result.result,
//          "bill_id": result.bill && result.bill.bill_id,
//          "latest_action": result.bill && result.bill.latest_action,
//          "sponsor_id": result.bill && result.bill.sponsor_id,
//          // "title": result.bill && result.bill.title,
//          "title": result.description,
//          "committees":""
//
//        }
//        return resultObject
//       })
//     })
//    const bills = arrayRep && Array.isArray(arrayRep)
//    && arrayRep.map(bill =>{
//      return bill
//    })
//    return bills;
// }
//
export async function getCandidateVoteRecord(id) {
  const storedBills = await AppStore.get("bills");
  const formData = {
    request: "search",
    query: {user_id: "Test11@test.com"},
    resource: "vare_vote",
    id: ""
  };
  const reportData = await RESTCall.axiosQuery(formData)
    .then(reports => {
      // console.log('voteDataxx0',reports)

      const result =
        reports &&
        reports.data &&
        reports.data.length > 0 &&
        reports.data.map(res => {
          const voteInfo =
            storedBills &&
            storedBills.filter(rep => {
              // console.log('voteDataxx2',rep.bill_id,res.item_id)
              return rep.bill_id == res.item_id;
            })[0];

          if (voteInfo && Object.keys(voteInfo).length > 0) {
            const billDetails = {
              bill_id: voteInfo.bill_id,
              committees: voteInfo.committees,
              description: voteInfo.description
                ? voteInfo.description
                : voteInfo.title,
              introduced_date: voteInfo.introduced_date,
              latest_action: voteInfo.latest_action,
              member_id: res.user_id,
              policy: voteInfo.policy,
              position: res.vote,
              result: voteInfo.result,
              sponsor_id: voteInfo.sponsor_id,
              time: res.Timestamp,
              title: voteInfo.title
            };
            return billDetails;
          }
        });
      return result;
    })
    .catch(error => {
      return "";
    });
  // AppStore.save({ 'myGeoReport': reportData })
  return reportData;
}

export async function getVoteMatchPct(member_id) {
  const myVote = await AppStore.get("myVote");
  const congress = await AppStore.get("congress");

  const matchInfo = congress.map(res => {
    return res.record.filter(resb => {
      // console.log('xxccvv',myVote, resb.bill.bill_id)

      return Object.keys(myVote).includes(resb.bill.bill_id) == true;
    });
  });
}

export async function dbVoteCount(myVote) {
  // console.log('sssssmyVote',myVote)
  // const myVote = await AppStore.get('myVote')
  const voteArray = Object.keys(myVote);
  const formData = {
    request: "searchArray",
    keyName: "item_id",
    query: voteArray, //add table key value peers to search for
    resource: "vare_vote",
    id: "",
    orderme: "asc"
  };
  return await RESTCall.axiosQuery(formData).then(rep => {
    // console.log('rep',rep)

    const myVoteCount =
      rep &&
      rep.data &&
      rep.data.length > 0 &&
      rep.data.map(info => {
        const myObject = {};
        const infoYes =
          info.votes && info.votes.no && info.votes.no >= 0
            ? info.votes.no * 1
            : 0;
        const infoNo =
          info.votes && info.votes.yes && info.votes.yes >= 0
            ? info.votes.yes * 1
            : 0;
        const calc =
          infoYes > 0
            ? (infoYes / (infoYes + infoNo)) * 100
            : info.count > 0
            ? 100 - (infoNo / (infoYes + infoNo)) * 100
            : 0;

        myObject["yes"] = info.votes.yes ? info.votes.yes : 0;
        myObject["no"] = info.votes.no ? info.votes.no : 0;
        myObject["count"] = info.count;
        myObject["pst"] = calc ? calc : 0;
        myObject["item_id"] = info._id;

        return myObject;
      });

    return myVoteCount;
  });
}

export async function dbDebateVoteCountvv(myVote) {
  // console.log('sssssmyVote',myVote)
  // const myVote = await AppStore.get('myVote')
  const voteArray = Object.keys(myVote);
  const formData = {
    request: "searchArray",
    keyName: "item_id",
    query: voteArray, //add table key value peers to search for
    resource: "vare_vote",
    id: "",
    orderme: "asc"
  };
  return await RESTCall.axiosQuery(formData)
    .then(rep => {
      // console.log('ssssrepInfoC', rep.data)
      const myVoteCount = [];
      myVote &&
        Object.keys(myVote) &&
        Object.keys(myVote).map(info => {
          const myObject = {};
          const count = rep.data.filter(ref => {
            return info == ref["item_id"];
          });
          const countYes = rep.data.filter(ref => {
            return info == ref["item_id"] && ref["vote"] == "yes";
          });
          const countNo = rep.data.filter(ref => {
            return info == ref["item_id"] && ref["vote"] == "no";
          });
          if (countYes.length > 0 || countNo.length > 0) {
            const calc =
              countYes.length > 0
                ? (countYes.length / (countYes.length + countNo.length)) * 100
                : countNo.length > 0
                ? 100 -
                  (countNo.length / (countYes.length + countNo.length)) * 100
                : 0;
            myObject["yes"] = countYes.length;
            myObject["no"] = countNo.length;
            myObject["count"] = count.length;
            myObject["pst"] = calc ? calc : 0;
            myObject["item_id"] = info;
            myVoteCount.push(myObject);
          }
        });
      // console.log('count',myVoteCount)
      AppStore.save({myVoteCount: myVoteCount});
      return myVoteCount;
    })
    .catch(error => {
      return "";
    });
}

export async function insertDatabase(formData) {
  const result = await RESTCall.axiosQuery(formData)
    .then(response => {
      return response && response.data;
    })
    .catch(error => {
      return error;
    });
  return result;
}

export async function dbGetReports() {
  const myState = await getSateFromProfile();
  // console.log('myState',myState)

  const formData = {
    request: "get",
    resource: "vare_reports"
  };
  const reportData = await RESTCall.axiosQuery(formData)
    .then(reports => {
      // console.log('reports',reports)
      const newReport =
        reports.data && reports.data.length > 0
          ? reports.data.map(res => {
              const profileState =
                res.address &&
                res.address.split(",") &&
                res.address.split(",")[2] &&
                res.address.split(",")[2].split(" ") &&
                res.address.split(",")[2].split(" ")[1];
              res["state"] = profileState;
              return res;
            })
          : [];

      const reply = newReport.filter(rep => {
        return (
          myState &&
          rep.state &&
          myState.toLowerCase() == rep.state.toLowerCase() &&
          rep.event_status == 1
        );
      });
      return reply;
    })
    .catch(error => {
      return "";
    });
  // console.log('reportData',reportData)
  // AppStore.save({ 'myGeoReport': reportData })
  return reportData;
}

// todo -used in Ligislation component and others.  Refactor to call function rom here
export async function dbGetCheckinReports() {
  const formData = {
    request: "get",
    resource: "vare_checkin"
  };
  const reportData = await RESTCall.axiosQuery(formData)
    .then(reports => {
      return reports && reports.data;
    })
    .catch(error => {
      return "";
    });
  // console.log('reportData',reportData)
  AppStore.save({myGeoReport: reportData.data});
  return reportData.data;
}

// todo -used in Ligislation component and others.  Refactor to call function rom here
export async function databaseSaveVote(props) {
  const {itemInfo, myVote, influencer_id} = props;

  const itemKey = itemInfo && itemInfo;

  let myInfo = await AppStore.get("myInfo");
  if (myInfo && myInfo.address && myInfo.email) {
    const influencerInfo =
      !influencer_id || influencer_id == "NA"
        ? {}
        : {influencer_id: influencer_id};
    const dbVote = {
      ...influencerInfo,
      facebook: myInfo.facebook,
      instagram: myInfo.instagram,
      name: myInfo.fullName,
      img: myInfo.img,
      date: moment().format(),
      user_id: myInfo.user_id ? myInfo.user_id : myInfo.email,
      item_id: itemKey
        ? itemKey
        : props["item_id"]
        ? props["item_id"]
        : props["bill_id"],
      title: props["title"],
      vote: props["vote"],
      sex: myInfo.age,
      age: myInfo.age,
      race: myInfo.race,
      party: myInfo.party
    };
    // console.log("xxxx", props);

    const formData = {
      request: "insert",
      query: dbVote,
      resource: "vare_vote",
      check: ["item_id", "user_id"]
    };
    return await RESTCall.axiosQuery(formData)
      .then(response => {
        // console.log("postInfo", response);
        return response;
      })
      .catch(error => {
        return error;
      });
  } else {
    this.props.navigation.navigate("ProfileScreen", {
      profile: "Contact Information"
    });
  }
}

export async function databaseSaveRSVP({meeting_id, author_id}) {
  let myInfo = await AppStore.get("myInfo");
  // console.log('xxxx',myInfo.address, myInfo.email,itemKey,myInfo,myVote)
  if (myInfo && myInfo.address && myInfo.email) {
    const dbVote = {
      name: myInfo.fullName,
      meeting_id: meeting_id,
      author_id: author_id,
      user_id: myInfo.user_id,
      img: myInfo.img,
      attending: "yes",
      publishedAt: new Date(),
      sex: myInfo.age,
      age: myInfo.age,
      race: myInfo.race,
      party: myInfo.party
    };
    const formData = {
      request: "insert",
      query: dbVote,
      resource: "vare_meeting_rsvp",
      check: ["meeting_id", "user_id"]
    };
    return await RESTCall.axiosQuery(formData)
      .then(response => {
        // console.log('databaseSaveRSVP',response)
        return response;
      })
      .catch(error => {
        return error;
      });
  }
}

//---------------------all members
// export async function getPresidentialBills() {
//   const formData = {
//     request:'get',
//     resource: 'vare_exec'
//   }
//   const results = await RESTCall.axiosQuery(formData)
//    .then(result => {
//       result.map(res => {
//          Object.keys(res).map(info => {
//              res[info] = typeof(res[info]) == 'string'
//              ? res[info].replace(/"/g, "")
//              : res[info]
//              res['bill_id'] = res.executive_order_number.toString()
//            })
//       });
//      return result;
//     })
//     return results
//
// }

export async function getLocalCandidatesByElection({page, myState}) {
  let pageNumber = page ? page : 1;
  let limit = 100;
  let year = 2020;

  let url = "";
  if (myState && myState !== "") {
    // url = `https://api.open.fec.gov/v1/candidates/search/?per_page=${limit}&sort_nulls_last=false&sort_hide_null=false&sort=name&api_key=TyHF6sThNWi1b8hKiYRDMeIcgHuqB0QdIXaUeoGz&page=${pageNumber}&election_state=${myState}&year=${year}`
    url = `https://api.open.fec.gov/v1/candidates/?api_key=TyHF6sThNWi1b8hKiYRDMeIcgHuqB0QdIXaUeoGz&sort_hide_null=false&sort_nulls_last=false&year=2020&per_page=20&state=TX&sort_null_only=false&page=1&sort=name`;
  } else {
    url = `https://api.open.fec.gov/v1/candidates/?api_key=TyHF6sThNWi1b8hKiYRDMeIcgHuqB0QdIXaUeoGz&sort_hide_null=false&sort_nulls_last=false&year=2020&per_page=20&state=TX&sort_null_only=false&page=1&sort=name`;
    // url = `https://api.open.fec.gov/v1/candidates/search/?per_page=${limit}&sort_nulls_last=false&sort_hide_null=false&sort=name&api_key=TyHF6sThNWi1b8hKiYRDMeIcgHuqB0QdIXaUeoGz&page=${pageNumber}&year=${year}`
  }

  let contestants = await fetch(url).then(response => response.json());
  // console.log('xxx2224',contestants)

  const info =
    contestants.results &&
    contestants.results.length > 0 &&
    contestants.results.map(contestant => {
      // console.log('contestant',contestant)
      const result = {
        name: contestant.name ? contestant.name : "",
        party: contestant.party_full ? contestant.party_full : "",
        office: contestant.office_full ? contestant.office_full : "",
        district: contestant.district ? contestant.district : "",
        level: contestant.office_full ? contestant.office_full : "",
        challenger: contestant.incumbent_challenge_full
          ? contestant.incumbent_challenge_full
          : "",
        candidate_id: contestant.candidate_id ? contestant.candidate_id : "",
        state: contestant.state,
        active:
          contestant.candidate_inactive == true
            ? false
            : contestant.candidate_inactive == false
            ? true
            : null
      };
      return result;
    });
  // rep['contests'] = info;
  return info;
}

//---------------------form VARE Save DB
export async function getMandates() {
  const formData = {
    request: "get",
    resource: "vare_mandates"
  };
  const allResult = await RESTCall.axiosQuery(formData);
  return (
    allResult.data &&
    allResult.data.length > 0 &&
    Promise.all(
      allResult.data.map(rep => {
        const formData = {
          request: "search",
          query: {user_id: rep.member_id},
          resource: "vare_user",
          id: ""
        };
        return getMandatesAuthor(rep, formData);
      })
    )
  );
}

export async function getMandatesAuthor(rep, formData) {
  const memberInfo = await RESTCall.axiosQuery(formData);
  // console.log('tempBillmemberInfo',memberInfo)
  rep["name"] = memberInfo.fullName ? memberInfo.fullName : "Private";

  rep["bill_id"] = memberInfo.id ? memberInfo.id : "na";
  // console.log('tempBillmemberInfo',rep)

  return rep;
}

export async function getDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1;

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  var today = dd + "/" + mm + "/" + yyyy;
  return today;
}

// console.log('xxxmyProfile',myProfile)
export async function getSateFromProfile() {
  const myProfile = await AppStore.get("myProfile");
  const myInfo = await AppStore.get("myInfo");

  const myTempProfile =
    myProfile.length > 0 || Object.keys(myProfile).length > 0 ? myProfile : "";

  const govLevel = myTempProfile && myTempProfile["Government Level"];

  const fedLevel = govLevel && govLevel["federal"];
  const stateLevel = govLevel && govLevel["state"];

  const address = myInfo && myInfo["address"];

  const profileState =
    stateLevel &&
    address &&
    address.split(",") &&
    address.split(",")[2] &&
    address.split(",")[2].split(" ") &&
    address.split(",")[2].split(" ")[1];

  if (profileState) {
    return profileState;
  } else {
    return "";
  }
}

export async function getCongressFromDB(allcongress) {
  const formData = {
    request: "get",
    resource: "vare_congress"
  };
  const allResult = await RESTCall.axiosQuery(formData);

  let existingDataKeys = [];
  const memberIdArray =
    allResult &&
    allResult.data &&
    allResult.data.length > 0 &&
    allResult.data.map(res => {
      existingDataKeys.push(res.member_id);
    });

  const records =
    allcongress && allcongress.length > 0
      ? allcongress.map((rep, index) => {
          if (
            existingDataKeys &&
            existingDataKeys.includes(rep.member_id) == false
          ) {
            const formData = {
              request: "insert",
              query: rep,
              resource: "vare_congress"
            };
            insertDatabase(formData).then(reply => {
              return reply;
            });
          }
        })
      : allResult;
  // console.log('allcongress',allResult,records)
  return records;
}

export async function groupBy(items, prop) {
  // console.log('xxx',items, prop)
  return await items.reduce(function(groups, item) {
    const val = item[prop];
    groups[val] = groups[val] || [];
    groups[val].push(item);
    return groups;
  }, {});
}

// https://projects.propublica.org/api-docs/congress-api/votes/#get-recent-votes
//votes of member by bill

// https://api.propublica.org/congress/v1/115/senate/committees.json
// get all committees
//---
// Lists of Members
// GET https://api.propublica.org/congress/v1/{congress}/{chamber}/members.json
// curl "https://api.propublica.org/congress/v1/116/senate/members.json"
//   -H "X-API-Key: PROPUBLICA_API_KEY"

//---
// Get a Specific Member’s Vote Positions
// GET https://api.propublica.org/congress/v1/members/{member-id}/votes.json
// curl "https://api.propublica.org/congress/v1/members/K000388/votes.json"
//   -H "X-API-Key: PROPUBLICA_API_KEY"

//---
// https://projects.propublica.org/api-docs/congress-api/bills/
// Among the attributes contained in the response are enacted, vetoed, house_passage, senate_passage, house_passage_vote and senate_passage_vote; these are either null or display a date indicating when that particular action occurred on the bill.
// HTTP Request
// GET https://api.propublica.org/congress/v1/{congress}/{chamber}/bills/{type}.json

//---
// Get Recent Bills
// curl "https://api.propublica.org/congress/v1/members/L000287/bills/introduced.json"
//   -H "X-API-Key: PROPUBLICA_API_KEY"
// Type	Sort Field
// introduced	introduced_date
// updated	latest_major_action_date
// active	latest_major_action_date
// passed	latest_major_action_date
// enacted	enacted
// vetoed	vetoed

//-------
// Get Recent Bills by a Specific Member
// GET https://api.propublica.org/congress/v1/members/{member-id}/bills/{type}.json
// curl "https://api.propublica.org/congress/v1/members/L000287/bills/introduced.json"
//   -H "X-API-Key: PROPUBLICA_API_KEY"
// Type	Sort Field
// introduced	introduced_date
// updated	latest_major_action_date
// active	latest_major_action_date
// passed	latest_major_action_date
// enacted	enacted
// vetoed	vetoed
// HTTP Request

//-------
// Get Recent Bills by a Specific Subject
// GET https://api.propublica.org/congress/v1/bills/subjects/{subject}.json
// curl "https://api.propublica.org/congress/v1/bills/subjects/meat.json"
//   -H "X-API-Key: PROPUBLICA_API_KEY"

//-------
// Get a Specific Bill
// GET https://api.propublica.org/congress/v1/{congress}/bills/{bill-id}.json
// curl "https://api.propublica.org/congress/v1/bills/subjects/search.json?query=climate"
//   -H "X-API-Key: PROPUBLICA_API_KEY"

//------
// Get Upcoming Bills
// GET https://api.propublica.org/congress/v1/bills/upcoming/{chamber}.json
// curl "https://api.propublica.org/congress/v1/bills/upcoming/house.json"
//   -H "X-API-Key: PROPUBLICA_API_KEY"
