const { getPRhead } = require('./../utils/pullForkUtil');
const {
  getPullRequest,
  mergePullRequest,
  closePullRequest
 } = require('./../utils/gitHubUtil');
const { gitHeadUtil } = require('./../utils/gitHeadUtil');
const {
        postCreateRepoTestDB,
        postCreateTokenSupplyTestDB,
        postSetTSrepoHeadTestDB,
        postSetQuorumTestDB,
        postNewPullRequestTestDB,
        postSetContributorVotedTokensTestDB,
        postAddToTotalVotedYesTokensDB,
	//postSetVote,
      } = require('./../utils/requests')
const {
        postCreateRepo,
	postGetContributorTokenAmount,
        postTransferTokens,
        postSetVote,
        postGetPRvoteStatus,
        postGetPRvoteYesTotals,
        postGetPRvoteNoTotals,
        postGetPRvoteTotals,
      } = require('./../utils/privateStoreRequests')
const { //createRepo,
        createTokenSupply,
        //transferTokens,
        setQuorum,
        newPullRequest,
        setContributorVotedTokens,
        getContributorTokens,
        getTSpullRequest,
        getAllTSpullRequests,
        deleteTSpullRequest,
        getContributorVotedTokens,
        getAllVotedTokens,
        getQuorum,
        getTokenSupply,
        getTotalVotedTokens,
        getTotalVotedYesTokens,
        getTotalVotedNoTokens,
        addToTotalVotedTokens,
        addToTotalVotedYesTokens,
        addToTotalVotedNoTokens,
        //setVoteSide,
        getOpenPullRequest,
        setOpenPullRequest,
        setTSrepoHead,
        getTSrepoHead,
        setPullRequestStatus,
        addToMergePullRequestHistory,
        addToRejectPullRequestHistory,
        getPullRequestFromHistory,
        getRepoStatus,
        checkContributor,
        checkMergePullRequestHistory,
        checkRejectPullRequestHistory,
        //getContributorTokenAmount
 } = require('./state');

const root = {
  // Also a root 'methods' in graphql query, by the same name
  getPRvote: function (database, args) {
    const prID = args.pr_id.split('_')[1]

    const tsPullRequest = getTSpullRequest(database, args)

    if (typeof tsPullRequest === 'undefined') {
      return undefined
    } else {
      const votedTokens = getContributorVotedTokens(database, args)
      return votedTokens
    }
  },
  getPRvoteTotals: function (database, args) {
      const prID = args.pr_id.split('_')[1]
      //This is a little weird because it should
      //Already have a value but leaving here just
      // in case. It will get resolved below.
      var totalVotedTokens = 0;
      var totalVotedYesTokens = 0;
      var totalVotedNoTokens = 0;

      const tsPullRequest = getTSpullRequest(database, args)

      var percentVotedQuorum

      if (tsPullRequest) {
        // Check if pull is halted
        // If no

        const supply = getTokenSupply(database, args)
        const quorum = getQuorum(database, args)

        totalVotedTokens = getTotalVotedTokens(database, args)

        totalVotedYesTokens = getTotalVotedYesTokens(database, args)

        totalVotedNoTokens = getTotalVotedNoTokens(database, args)

        percentVotedQuorum = totalVotedTokens/supply
        c= totalVotedTokens/(supply*quorum)
      } else {
        "none"
      }

      return {
        percentVotedQuorum: percentVotedQuorum,
        totalVotedTokens: totalVotedTokens,
        totalVotedYesTokens: totalVotedYesTokens,
        totalVotedNoTokens: totalVotedNoTokens
      }
  },
  getContributorTokenAmount: async function(database, args) {
    //const contributorTokenAmount = getContributorTokenAmount(database, args)
    const contributorTokenAmount =
        await postGetContributorTokenAmount(
          "",
          `${args.owner}/${args.repo}`,
          args.pr_id,
          args.contributor_id,
          args.side,
        )
    return contributorTokenAmount
  },
  getPRvoteStatus: async function(args) {
      const status =
          await postGetPRvoteStatus(
            args.owner,
            `${args.owner}/${args.repo}`,
            args.pr_id,
            "",
            "",
         )

      return status
  },
  pullAndVoteStatus: async function(database, pullReqRepoHead, args) {
    const prID = (args.pr_id).split('_')[1]
    var votedAlready;

    const activePullRequests = getAllTSpullRequests(database, args)
    const numberActivePullRequests = Object.keys(activePullRequests).length

    //Fix: shouldn't make state changes in status check.
    if (numberActivePullRequests === 0) {
       database = setOpenPullRequest(database, args, prID)
    }
    const openPullRequest = getOpenPullRequest(database,args)

    const tokens = getContributorTokens(database, args)

    // We can only use the function if there asking for about a
    // specific pull request.
    console.log('owner ' + args.owner)
    console.log('repo ' + args.repo)
    console.log('pr_id ' + prID)
    console.log('tokens ' + tokens)

    const prVoteStatusNow = module.exports.getPRvoteStatus(database, args)
    if (prVoteStatusNow === 'none') {
       votedAlready = false
    } else {
      const allVotedTokens = getAllVotedTokens(database, args)
      votedAlready = Object.keys(allVotedTokens).includes(args.contributor_id)
      console.log(args.contributor_id + ' voted already: ' + votedAlready)
    }

    const openPullRequestStatus = (openPullRequest === prID || openPullRequest === '');

    console.log('op pr status: ' + openPullRequestStatus)

    const alreadyHead = (pullReqRepoHead === getTSrepoHead(database, args))

    console.log('pullReqHead')
    console.log(pullReqRepoHead)
    console.log(getTSrepoHead(database, args))
    console.log(alreadyHead)

    console.log("s 391")
    const closedMerge = (prVoteStatusNow === 'closed' || prVoteStatusNow === 'merge')
    console.log((!closedMerge && !votedAlready && openPullRequestStatus && !alreadyHead))

    const pullAndVoteStatus = (!closedMerge && !votedAlready && openPullRequestStatus && !alreadyHead)

    return {
      pullAndVoteStatus: pullAndVoteStatus,
      db: database
    }
    //return {
    //         prVoteStatusNow: prVoteStatusNow,
    //         votedAlready: votedAlready,
    //         openPullRequestStatus: openPullRequestStatus,
    //         alreadyHead: alreadyHead
    //}

  },
  setVote: async function(args) {
      //console.log('\nvote code:\n' + vote_code)
      const resSetVote =
	await postSetVote(
          args.owner,
          `${args.owner}/${args.repo}`,
         args.pr_id,
         args.contributor_id,
         args.side,
       )
      
    const prVoteStatus = module.exports.getPRvoteStatus(args)

      //
      //if (Number(resSetVote) === 201) {
      //        if (prVoteStatus === 'merged') {
      //          await mergePullRequest(args.owner, args.repo, prID)
      //        } else if (prVoteStatus === 'closed') {
      //          // Add to history
      //          pullRequestVoteCloseHistory = addToRejectPullRequestHistory(pullRequestVoteCloseHistory, args)

      //          await closePullRequest(args.owner, args.repo, prID)
      //        }
      //}
	
      
    return prVoteStatus
  },
  updatePRvoteStatus: async function(database, args, tokens) {
    const prID = args.pr_id.split('_')[1]
    const prVoteStatusNow = module.exports.getPRvoteStatus(database, args)
    console.log(database)
    prVoteStatusUpdated = prVoteStatusNow

    if (prVoteStatusNow === 'open') {
      await postSetContributorVotedTokensTestDB(
        args.owner,
        args.repo,
        args.pr_id,
        args.contributor_id,
        args.side,
        tokens
      )

      //To be deprecated for above.
      database = setContributorVotedTokens(database, args, tokens, args.side)

      console.log('upr 212')

      database = setVoteSide(database, args)

      //Add yes and not votes to tally.
      database = addToTotalVotedTokens(database, args, tokens)
      if (args.side === "yes") {

        await postAddToTotalVotedYesTokensDB(
          args.owner,
          args.repo,
          args.pr_id,
          args.contributor_id,
          args.side,
          tokens
        )

        //To be deprecated for above.
        database = addToTotalVotedYesTokens(database, args, tokens)
      } else {
        database = addToTotalVotedNoTokens(database, args, tokens)
      }

      prVoteStatusUpdated = module.exports.getPRvoteStatus(database, args)

      database = setPullRequestStatus(database, args, prVoteStatusUpdated)

      console.log('upr 228')
    }

    // Maybe should have index increment to know if updated or not
    return {
             db: database,
             prVoteStatusUpdated: prVoteStatusUpdated
    }
  },
  transferTokens: async (database, pullRequestsDB, args) => {
    const restTransferTokens =
        await postTransferTokens(
          "",
          `${args.owner}/${args.repo}`,
          args.from,
          args.to,
          args.amount,
        )

    return resTransferTokens
  },
  createRepo: async (database, pullRequestsDB, args) => {
    const resCreateRepo =
        await postCreateRepo(
          "",
          `${args.owner}/${args.repo}`,
          args.pr_id,
          args.contributor_id,
          args.side,
	  // args.head?
        )

    // May need to implement in privateStore
    //database = setTSrepoHead(database, args, head)

    return resCreateRepo
  },
  newPullRequest: async (database, pullRequestsDB, args) => {
    const prVoteStatus = module.exports.getPRvoteStatus(database, args)

    const resNewPullRequest = newPullRequest(database, pullRequestsDB, args, prVoteStatus)

    await postNewPullRequestTestDB(
      args.owner,
      args.repo,
      args.pr_id,
      args.contributor_id,
      args.side,
      prVoteStatus
    )

    //To be deprecated for above.
    database = resNewPullRequest.db
    pullRequestsDB = resNewPullRequest.pullRequestsDB

    return {
             pullRequestsDB: pullRequestsDB,
             db: database
    }
  },
  getActivePullRequestsCount: function(database, args) {
    const activePullRequests = getAllTSpullRequests(database, args)
    const numberActivePullRequests = Object.keys(activePullRequests).length

    return numberActivePullRequests

  },
  getRepoStatus: function(database, args) {
    const status = getRepoStatus(database, args)

    return status
  },
  getContributors: function(database, args) {
    const status = getRepoStatus(database, args)

    return status
  },
  checkContributor: function(database, args) {
    const contributor_exists = checkContributor(database, args)

    return contributor_exists
  },
  checkMergePullRequestHistory: function(pullRequestVoteMergeHistory, args) {
    const status = checkMergePullRequestHistory(pullRequestVoteMergeHistory, args)

    return status
  },
  checkRejectPullRequestHistory: function(pullRequestVoteCloseHistory, args) {
    const status = checkRejectPullRequestHistory(pullRequestVoteCloseHistory, args)

    return status
  },
};

module.exports = root
