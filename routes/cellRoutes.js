import express from 'express';
import { createCell, getCellById, getAllCells, getCellsByStatus, updateCellById, deleteCellById, parkVehicle, calculatePayment, exitVehicle } from '../controllers/cellController.js';

const router = express.Router();

router.post('/create', createCell);
router.get('/:id', getCellById);
router.get('/', getAllCells);
router.get('/status/:status', getCellsByStatus);
router.put('/:id', updateCellById);
router.delete('/:id', deleteCellById);
router.post('/park', parkVehicle);
router.get('/payment/:id', calculatePayment);
router.post('/exit/:id', exitVehicle);

export default router;


