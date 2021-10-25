import * as Yup from 'yup';
import UserTech from '../models/UserTech';
import User from '../models/User';
import Tech from '../models/Tech';

module.exports = {
  async store(req, res) {
    const schema = Yup.object().shape({
      tech_id: Yup.number().required(),
      user_id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação, verifique os campos.' });
    }

    const userExists = await User.findByPk(req.body.user_id);
    const techExists = await Tech.findByPk(req.body.tech_id);

    if (!userExists) {
      return res.status(404).json({ error: 'Usuário não existe' });
    }

    if (!techExists) {
      return res.status(404).json({ error: 'Tecnologia não existe' });
    }

    try {
      await UserTech.create(req.body);

      return res.status(201).json({ message: 'Tecnologia conectada ao usuário com sucesso!' });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Ocorreu um erro ao conectar a tecnologia ao usuário.' });
    }
  },

  async index(req, res) {
    try {
      const user_techs = await UserTech.findAll();

      if (user_techs.length === 0) {
        return res.status(404).json({ error: 'Nenhum dado encontrado' });
      }

      return res.status(200).json({ user_techs });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Ocorreu um erro ao exibir os dados' });
    }
  },

  async update(req, res) {
    const schema = Yup.object().shape({
        user_id: Yup.number(),
        tech_id: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    let { user_id, tech_id } = req.body;

    const user_techs = await UserTech.findByPk(req.params.id);

    if (user_id == null) {
      user_id = user_techs.user_id;
    } else if (user_id !== user_techs.user_id) {
      const userExists = await User.findByPk(user_id);

      if (!userExists) {
        return res.status(404).json({ error: 'Usuário não existe' });
      }
    }

    if (tech_id == null) {
      tech_id = user_techs.tech_id;
    } else if (tech_id !== user_techs.tech_id) {
      const techExists = await Tech.findByPk(tech_id);

      if (!techExists) {
        return res.status(404).json({ error: 'Tecnologia não existe' });
      }
    }

    try {
      await user_techs.update(req.body);

      return res.status(200).json({ message: 'Ligação entre tecnologia e usuário atualizada com sucesso.' });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Ocorreu um erro ao atualizar a Ligação entre tecnologia e usuário' });
    }
  },

  async delete(req, res) {
    try {
      const user_techs = await UserTech.findByPk(req.params.id);

      await user_techs.destroy();
      return res.status(200).json({ message: 'Ligação entre tecnologia e usuário deletada com sucesso' });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Ocorreu um erro ao deletar a ligação entre tecnologia e usuário' });
    }
  },

  async show(req, res) {
    try {
      const user_techs = await UserTech.findByPk(req.params.id);

      if (!user_techs) {
        return res.status(404).json({ error: 'Ligação entre tecnologia e usuário não encontrada' });
      }

      return res.status(200).json({ user_techs });
    } catch (e) {
      return res.status(400).json({ error: 'Ocorreu um erro ao exibir a ligação' });
    }
  }
};
