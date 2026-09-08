const MentorshipServiceProxy = require('../../infrastructure/http/MentorshipServiceProxy');

class MentorshipController {
    constructor(proxy = new MentorshipServiceProxy()) {
        this.proxy = proxy;
        this.forward = this.forward.bind(this);
    }

    async forward(req, res) {
        return await this.proxy.forwardRequest(req, res);
    }
}

const defaultMentorshipController = new MentorshipController();

module.exports = {
    MentorshipController,
    mentorshipController: defaultMentorshipController,
    forward: defaultMentorshipController.forward,
};
