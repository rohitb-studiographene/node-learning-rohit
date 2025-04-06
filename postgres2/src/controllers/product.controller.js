import { createProductSchema, updateProductSchema } from '../schemas/product.schema.js';
import { ProductModel } from '../models/product.model.js';

export const createProduct = async (req, res) => {
  try {
    const productData = createProductSchema.parse(req.body);
    const product = await ProductModel.create(productData);
    res.status(201).json(product);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.findAll();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const product = await ProductModel.findById(productId);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const productData = updateProductSchema.parse(req.body);
    
    const product = await ProductModel.update(productId, productData);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: error.errors });
    }
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = parseInt(req.params.id);
    const deleted = await ProductModel.delete(productId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 