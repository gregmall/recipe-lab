const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');
const Log = require('../lib/models/log');

describe('recipe-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a recipe', async () => {
    const res = await request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      });
    expect(res.body).toEqual({
      id: expect.any(String),
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
  });

  it('gets all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });

  it('gets a recipe by id', async() => {  
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const response = await request(app)
      .get(`/api/v1/recipes/${recipe.id}`);

      expect(response.body).toEqual(recipe);

 });

  it('updates a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send({
        name: 'good cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          name: 'good cookies',
          directions: [
            'preheat oven to 375',
            'mix ingredients',
            'put dough on cookie sheet',
            'bake for 10 minutes'
          ]
        });
      });
  });

  it('deletes a recipe by id', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const response = await request(app)
      .delete(`/api/v1/recipes/${recipe.id}`)

      expect(response.body).toEqual(recipe);
  });
});

describe('lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });
  it('creates a log', async () => {
    const res = await request(app)
      .post('/api/v1/log')
      .send({
        recipeId: '5',
        dateOfEvent: '03-25-21',
        notes: 'it was delicious',
        rating: '4.5 stars'
      });
    expect(res.body).toEqual({
      id: expect.any(String),
      recipeId: '5',
      dateOfEvent: '03-25-21',
      notes: 'it was delicious',
      rating: '4.5 stars'
    });


  });
  it('gets all logs', async() => {
    const logs = await Promise.all([
      {
        recipeId: '5',
        dateOfEvent: '03-25-21',
        notes: 'it was delicious',
        rating: '4.5 stars'
      },
      {
        recipeId: '6',
        dateOfEvent: '04-25-21',
        notes: 'it was ok',
        rating: '3 stars'
      },
      {
        recipeId: '7',
        dateOfEvent: '05-25-21',
        notes: 'it was amaze balls',
        rating: '5 stars'
      }


    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/log')
      .then(res =>{
        logs.forEach(log => {
          expect(res.body).toContainEqual(log)
        });
      });

  });
  it('gets a log by id', async() => {
    const log = await Log.insert({
      recipeId: '5',
        dateOfEvent: '03-25-21',
        notes: 'it was delicious',
        rating: '4.5 stars'


    });
    const response = await request(app)
      .get(`/api/v1/log/${log.id}`);

      expect(response.body).toEqual(log);


  })





});
