import * as Yup from 'yup';
import User from '../models/User';
import Tech from '../models/Tech';

module.exports = {
  async store(req, res) {
    const user = await User.findByPk(req.userId);

    const { name, year_created } = req.body;

    if (!user) {
      return res.status(400).json({
        error: `Usuário não encontrado`,
      });
    }

    const [tech] = await Tech.findOrCreate({
      where: { name, year_created },
    });

    console.log(user);

    await user.addTech(tech);

    return res.json(tech);
  },

  async index(req, res) {
    try {
      const techs = await Tech.findAll();

      if (techs.length === 0) {
        return res.status(401).json({ error: 'Nenhuma tecnologia encontrada' });
      }

      return res.json({ techs });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Ocorreu um erro ao exibir as tecnologias' });
    }
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      year_created: Yup.number()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação' });
    }

    const { name, year_created } = req.body;

    const tech = await Tech.findByPk(req.params.techId);

    if (name !== tech.name) {
      const techExists = await User.findOne({ where: { name } });

      if (techExists) {
        return res.status(400).json({ error: 'Tecnologia já existe' });
      }
    }

    try {
      const { id, name, year_created } = await tech.update(req.body);

      return res.json({ id, name, year_created });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Ocorreu um erro ao atualizar o perfil' });
    }
  },

  async delete(req, res) {
    try {
      const tech = await Tech.findByPk(req.params.techId);

      await tech.destroy();
      return res.json({ message: 'Tecnologia deletada com sucesso' });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Ocorreu um erro ao deletar a tecnologia' });
    }
  },

  async show(req, res) {
    try {
      const tech = await Tech.findByPk(req.params.id);

      return res.json({ tech });
    } catch (e) {
      return res.status(400).json({ error: 'Tecnologia não encontrado' });
    }
  },

  async indexByName(req, res) {
    try {
      const techs = await Tech.findAll({ where: { name: req.body.name } });

      if (techs.length === 0) {
        return res.status(400).json({
          error: `Nenhuma tecnologia com o nome ${req.body.name} foi encontrada`,
        });
      }

      return res.json({ techs });
    } catch (e) {
      return res.status(400).json({
        error: `Ocorreu um erro ao exibir as tecnologias`,
      });
    }
  },

  async indexByYear(req, res) {
    try {
      const techs = await Tech.findAll({ where: { year_created: req.body.year_created } });

      if (techs.length === 0) {
        return res.status(400).json({
          error: `Nenhuma tecnologia com o ano ${req.body.year_created} foi encontrada`,
        });
      }

      return res.json({ techs });
    } catch (e) {
      return res.status(400).json({
        error: `Ocorreu um erro ao exibir as tecnologias`,
      });
    }
  }
};
