const superagent = require('superagent');

const { getServiceEndpoint } = require('./config');

//const endpoint =
//  process.env.NODE_ENV === "fly"
//    ? "https://namespace-db.fly.dev/graphql"
//    : "http://localhost:4003/graphql"

var root = {
  postCreateUser: async (
    contributor_id,
    contributor_name,
    contributor_password,
  ) => {
    const endpoint = await getServiceEndpoint('namespace');
    const res = await superagent
      .post(endpoint)
      .send({
        query: `
          {
            createUser(
              contributor_id: "${contributor_id}",
              contributor_name: "${contributor_name}",
              contributor_password: "${contributor_password}",
              ) {
              status
              message
              info {
                contributor_id
                contributor_name
              }
            }
          }
        `,
      })
      .set("accept", "json");

    const json = JSON.parse(res.text);
    return json.data.createUser;
  },
  postGetContributorName: async (owner, repo, defaultHash, contributor_id) => {
    const endpoint = await getServiceEndpoint('namespace');
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ getContributorName(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") }`
      })
      .set('accept', 'json');
    // .end((err, res) => {
    //   const json = JSON.parse(res.text);
    //   return json.data.getContributorName;
    // });
    const json = JSON.parse(res.text);
    return json.data.getContributorName;
  },
  postGetContributorID: async (owner, repo, defaultHash, contributor_name) => {
    const endpoint = await getServiceEndpoint('namespace');
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ getContributorID(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_name: "${contributor_name}") }`
      })
      .set('accept', 'json');
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getContributorID;
  },
  postGetContributorSignature: async (owner, repo, defaultHash, contributor_id) => {
    const endpoint = await getServiceEndpoint('namespace');
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ getContributorSignature(owner: "${owner}", repo: "${repo}", defaultHash: "${defaultHash}", contributor_id: "${contributor_id}") }`
      })
      .set('accept', 'json');
    //.end((err, res) => {
    // Calling the end function will send the request
    //});
    const json = JSON.parse(res.text);
    return json.data.getContributorSignature;
  },
  getUser: async (contributor_id) => {
    const endpoint = await getServiceEndpoint('namespace');
    const res = await superagent
      .post(endpoint)
      .send({
        query: `
	{
	  getUser(contributor_id: "${contributor_id}")
	  {
              status
              message
              info {
                contributor_id
                contributor_name
              }
            }
          }
        `,
      })
      .set('accept', 'json');
    const json = JSON.parse(res.text);
    return json.data.getUser;
  },
  getUserByName: async (contributor_name) => {
    const endpoint = await getServiceEndpoint('namespace');
    const res = await superagent
      .post(endpoint)
      .send({
        query: `
	{
	  getUserByName(contributor_name: "${contributor_name}")
	  {
              status
              message
              info {
                contributor_id
                contributor_name
              }
            }
          }
        `,
      })
      .set('accept', 'json');
    const json = JSON.parse(res.text);
    return json.data.getUserByName;
  },
  findOrCreateUser: async (
    owner,
    repo,
    contributor_id,
    contributor_name,
    contributor_signature,
    token) => {
    const endpoint = await getServiceEndpoint('namespace');
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ findOrCreateUser(owner: "${owner}", repo: "${repo}", contributor_id: "${contributor_id}", contributor_name: "${contributor_name}", contributor_signature: "${contributor_signature}", token: "${token}") {contributor_name, contributor_id, contributor_signature, token}}`
      })
      .set('accept', 'json');
    const json = JSON.parse(res.text);
    return json.data.findOrCreateUser;
  },
  findOrCreateNameSpaceRepo: async (
    contributor_id,
    repo_name,
    contributor_password) => {
    const endpoint = await getServiceEndpoint('namespace');
    const res = await superagent
      .post(endpoint)
      .send({
        query: `{ findOrCreateRepo(contributor_id: "${contributor_id}", repo_name: "${repo_name}", contributor_password: "${contributor_password}") {status, message, repoName, repoID, repoSignature}}`
      })
      .set('accept', 'json');
    const json = JSON.parse(res.text);
    console.log('turbosrc-service/src/utils/nameSpaceRequests.js findOrCreateNameSpaceRepo', json.data.findOrCreateRepo)
    //return json.data.findOrCreateNameSpaceRepo;
    return json.data.findOrCreateRepo;
  },
  getNameSpaceRepo: async (repoNameOrID) => {
    const endpoint = await getServiceEndpoint('namespace');
    const res = await superagent
      .post(endpoint)
      .send({
        query: `
          {
            getNameSpaceRepo(repoNameOrID: "${repoNameOrID}") {
              status
              message
              repoName
              repoID
              repoSignature
            }
          }
        `,
      })
      .set('accept', 'json');
    const json = JSON.parse(res.text);
    return json.data.getNameSpaceRepo;
  }
};

module.exports = root;
