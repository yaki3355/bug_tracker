const router = require('express').Router();
const moment = require('moment');
const {isAuth} = require('./auth');
const Bug = require('../models/bug');

router.get(/^\/(\d+)\/(\d+)/, isAuth, async (req, res, next) => {
    try {
        const filter = {};

        if (req.query.myResponsibility === 'true') filter.responsible = req.user.username;
        if (req.query.createdByMe === 'true') filter.createdBy = req.user.username;

        const skip = +req.params[0];
        const limit = +req.params[1];
        const bugs = await Bug.find(filter, {_id: 1, status: 1, description: 1, responsible: 1, createdBy:1}, {skip, limit});

        res.json(bugs);
    } catch(err) {
        next(err);
    }
});

router.get(/^\/total_num/, isAuth, async (req, res, next) => {
    try {
        const filter = {};

        if (req.query.myResponsibility === 'true') filter.responsible = req.user.username;
        if (req.query.createdByMe === 'true') filter.createdBy = req.user.username;

        const n = await Bug.countDocuments(filter);

        res.json(n);
    } catch(err) {
        next(err);
    }
});

router.get('/:id', isAuth, async (req, res, next) => {
    try {
        const bug = await Bug.findById(req.params.id).lean();

        bug.createdAt = formatDate(bug.createdAt);
        bug.updatedAt = formatDate(bug.updatedAt);
        bug.comments.forEach(c => c.createdAt = formatDate(c.createdAt));

        res.json(bug);
    } catch(err) {
        next(err);
    }
});

router.post('/', isAuth, async (req, res, next) => {
    const username = req.user.username;
    const {status, description, responsible, comment} = req.body;

    try {    
        if (await Bug.countDocuments({createdBy: username}) >= process.env.MAX_BUGS_TO_CREATE)
            return res.status(401).send(`Max number of bugs to create: ${process.env.MAX_BUGS_TO_CREATE}`); 

        const data = {
            status, 
            description, 
            responsible,
            createdBy: username, 
            updatedBy: username
        };

        if (comment) data.comments = [{createdBy: username, description: comment}];

        const bug = await new Bug(data).save();

        res.json({msg: `Bug ${bug._id} created`});
    } catch(err) {
        next(err);
    }
});

router.put('/:id', isAuth, async (req, res, next) => {
    const id = req.params.id;
    const username = req.user.username;
    const {status, description, responsible, comment} = req.body;

    try {
        const data = {
            status, 
            description, 
            responsible, 
            updatedAt: Date.now(), 
            updatedBy: username
        };

        if (comment) data.$push = {comments: {createdBy: username, description: comment}};

        const bug = await Bug.findByIdAndUpdate(id, data);
        
        res.json({msg: `Bug ${bug._id} updated`});
    } catch(err) {
        next(err);
    } 
});

router.delete('/:id', isAuth, async (req, res, next) => {
    try {
        const bug = await Bug.findByIdAndDelete(req.params.id);

        if (!req.user.isAdmin && bug.createdBy !== req.user.username)
            return res.status(401).send("You don't have permission to delete bug created by other");

        res.json({msg: `Bug ${bug._id} deleted`});
    } catch(err) {
        next(err);
    }
});

function formatDate(date) {
    return moment(date).format(process.env.TIME_FORMAT);
}

module.exports = router;