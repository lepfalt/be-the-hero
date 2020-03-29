const connection = require('../database/connection');

module.exports = {
    async index (request, response){
        const { page = 1 } = request.query; //paginação
        
        const [count] = await connection('incidents')
            .count();

        const incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(5) //retorna de 5 em 5
            .offset((page - 1) * 5) //pula páginas se eu quero a 2, pula os 5 primeiros registros
            .select([
                'incidents.*',
                'ongs.name', 
                'ongs.email', 
                'ongs.whatsapp', 
                'ongs.city', 
                'ongs.uf'
            ]);

        response.header('X-Total-Incident', count['count(*)']);

        return response.json(incidents);
    },

    async create(request, response){
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const result = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id            
        });

        const id = result[0];

        return response.json({ id });
    },

    async delete (request, response){
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if(incident == null)
        return response.status(404).json({ error: 'Incident not existes.' });

        if(incident.ong_id != ong_id)
            return response.status(401).json({ error: 'Operation not permited.' });

        await connection('incidents')
            .where('id', id)
            .delete();

        return response.status(204).send();
    }
};