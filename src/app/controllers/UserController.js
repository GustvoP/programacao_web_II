import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    try {
      const { id, name, email } = await User.create(req.body);

      return res.status(201).json({ id, name, email });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Ocorreu um erro ao criar o usuário' });
    }
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field,
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field,
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    try {
      const { id, name } = await user.update(req.body);

      return res.status(200).json({ id, name, email });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Ocorreu um erro ao atualizar o perfil' });
    }
  }

  async index(req, res) {
    try {
      const users = await User.findAll();

      if (users.length === 0) {
        return res.status(404).json({ error: 'Nenhum usuário encontrado' });
      }

      return res.status(200).json({ users });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Ocorreu um erro ao exibir os usuários' });
    }
  }

  async indexByName(req, res) {
    try {
      const users = await User.findAll({ where: { name: req.body.name } });

      if (users.length === 0) {
        return res.status(404).json({
          error: `Nenhum usuário com o nome ${req.body.name} foi encontrado`,
        });
      }

      return res.json({ users });
    } catch (e) {
      return res.status(400).json({
        error: `Ocorreu um erro ao exibir os usuários`,
      });
    }
  }

  async indexByEmail(req, res) {
    try {
      const user = await User.findOne({ where: { email: req.body.email } });

      if (user === null) {
        return res.status(404).json({
          error: `Nenhum usuário com o e-mail ${req.body.email} foi encontrado`,
        });
      }

      return res.json({ user });
    } catch (e) {
      return res.status(400).json({
        error: `Ocorreu um erro ao exibir os usuários`,
      });
    }
  }

  async show(req, res) {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.status(200).json({ user });
    } catch (e) {
      return res.status(400).json({ error: 'Ocorreu um erro ao exibir o usuário' });
    }
  }

  async delete(req, res) {
    try {
      const user = await User.findByPk(req.userId);

      await user.destroy();
      return res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Ocorreu um erro ao deletar o usuário' });
    }
  }
}

export default new UserController();
