import * as Yup from 'yup';
import User from '../models/User';
import Tech from '../models/Tech';

module.exports = {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      year_created: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const { name, year_created } = req.body;

    try {
      await Tech.create(req.body);

      return res.status(201).json({ message: 'Tecnologia criada com sucesso.' });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Ocorreu um erro ao criar a tecnologia.' });
    }
  },

  async index(req, res) {
    try {
      const techs = await Tech.findAll();

      if (techs.length === 0) {
        return res.status(404).json({ error: 'Nenhuma tecnologia encontrada' });
      }

      return res.status(200).json({ techs });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Ocorreu um erro ao exibir as tecnologias' });
    }
  },

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      year_created: Yup.number().required()
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Falha na validação.' });
    }

    const tech = await Tech.findByPk(req.params.techId);

    if (!tech) {
      return res.status(404).json({ error: 'Tecnologia não existe.' });
    }

    try {
      await tech.update(req.body);

      return res.status(200).json({ message: 'Tecnologia alterada com sucesso.' });
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
      return res.status(200).json({ message: 'Tecnologia deletada com sucesso' });
    } catch (e) {
      return res
        .status(400)
        .json({ error: 'Ocorreu um erro ao deletar a tecnologia' });
    }
  },

  async show(req, res) {
    try {
      const tech = await Tech.findByPk(req.params.id);

      if (!tech) {
        return res.status(404).json({ error: 'Tecnologia não encontrada.' });
      }

      return res.status(200).json({ tech });
    } catch (e) {
      return res.status(400).json({ error: 'Tecnologia não encontrada.' });
    }
  },

  async indexByName(req, res) {
    try {
      const techs = await Tech.findAll({ where: { name: req.body.name } });

      if (techs.length === 0) {
        return res.status(404).json({
          error: `Nenhuma tecnologia com o nome ${req.body.name} foi encontrada`,
        });
      }

      return res.status(200).json({ techs });
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
        return res.status(404).json({
          error: `Nenhuma tecnologia com o ano ${req.body.year_created} foi encontrada`,
        });
      }

      return res.status(200).json({ techs });
    } catch (e) {
      return res.status(400).json({
        error: `Ocorreu um erro ao exibir as tecnologias`,
      });
    }
  }
};
