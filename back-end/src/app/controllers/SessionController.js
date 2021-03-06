const Yup = require('yup');

const User = require('../models/User');

class SessionController {
  async store(req, res){
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required().min(4),
    });

    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails'})
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email }});

    if (!user) {
      return res.status(401).json({ error: 'User does not exist'})
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match'});
    }

    const { id, name } = user;

    console.log(user.id);
    
    return res.json({
        id,
        name,
        email,
    });
  }
}

module.exports = new SessionController();