import Cell from '../schemas/cellSchema.js';
import crypto from 'crypto';

// Create a new cell
export const createCell = async (req, res) => {
    try {
        const lastCell = await Cell.findOne().sort({ cellNumber: -1 });
        const nextCellNumber = lastCell ? lastCell.cellNumber + 1 : 1;

        if (nextCellNumber > 10) {
            return res.status(400).json({ msg: 'Cell limit of 10 has been reached' });
        }
        const { status = 'available' } = req.body;
        const cell = new Cell({ cellNumber: nextCellNumber, status });

        await cell.save();
        res.status(201).json(cell);
    } catch (error) {
        res.status(500).json({ msg: 'Error creating cell' });
    }
};

// Retrieve a specific cell by ID
export const getCellById = async (req, res) => {
    try {
        const cell = await Cell.findById(req.params.id);
        if (!cell) {
            return res.status(404).json({ msg: 'Cell not found' });
        }
        res.json(cell);
    } catch (error) {
        res.status(500).json({ msg: 'Error retrieving cell' });
    }
};

// Retrieve all cells
export const getAllCells = async (req, res) => {
    try {
        const cells = await Cell.find();
        res.json(cells);
    } catch (error) {
        res.status(500).json({ msg: 'Error retrieving cells' });
    }
};

// Retrieve cells by status
export const getCellsByStatus = async (req, res) => {
    try {
        const cells = await Cell.find({ status: req.params.status });
        res.json(cells);
    } catch (error) {
        res.status(500).json({ msg: 'Error retrieving cells' });
    }
};

// Update a specific cell
export const updateCellById = async (req, res) => {
    try {
        const cell = await Cell.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!cell) {
            return res.status(404).json({ msg: 'Cell not found' });
        }
        res.json(cell);
    } catch (error) {
        res.status(500).json({ msg: 'Error updating cell' });
    }
};

// Delete a specific cell
export const deleteCellById = async (req, res) => {
    try {
        const cell = await Cell.findByIdAndDelete(req.params.id);
        if (!cell) {
            return res.status(404).json({ msg: 'Cell not found' });
        }
        res.json({ msg: 'Cell deleted' });
    } catch (error) {
        res.status(500).json({ msg: 'Error deleting cell' });
    }
};

// Park a vehicle in an available cell
export const parkVehicle = async (req, res) => {
    try {
        const { vehiclePlate } = req.body;

        if (!vehiclePlate) {
            return res.status(400).json({ msg: 'Vehicle plate is required' });
        }

        const cell = await Cell.findOne({ status: 'available' });
        if (!cell) {
            return res.status(404).json({ msg: 'No available cells' });
        }

        cell.plateVehicle = vehiclePlate;
        cell.status = 'not available';
        cell.entryDate = new Date(); // Correctly set the entry date
        cell.pin = generatePin(cell.cellNumber, vehiclePlate);

        await cell.save();

        res.status(200).json(cell);
    } catch (error) {
        console.error('Error parking vehicle:', error);
        res.status(500).json({ msg: 'Error parking vehicle', error });
    }
};

// Example function to generate a PIN
const generatePin = (cellNumber, plateNumber) => {
    // Example implementation: concatenate cellNumber and plateNumber
    return `${cellNumber}-${plateNumber}`;
};

// Calculate the parking fee
// controllers/cellController.js

export const calculatePayment = async (req, res) => {
    try {
        const cell = await Cell.findById(req.params.id);

        if (!cell || !cell.entryDate || !cell.exitDate) {
            return res.status(400).json({ msg: 'Entry or exit date not found' });
        }

        const hoursParked = Math.ceil((cell.exitDate - cell.entryDate) / 3600000); // 1 hour = 3600000 ms
        const payment = hoursParked * 5000;

        res.json({ payment });
    } catch (error) {
        console.error('Error calculating payment:', error);
        res.status(500).json({ msg: 'Error calculating payment' });
    }
};




export const exitVehicle = async (req, res) => {
    try {
        const cell = await Cell.findById(req.params.id);

        if (!cell) {
            return res.status(404).json({ msg: 'Cell not found' });
        }

        if (cell.status === 'available' || !cell.plateVehicle) {
            return res.status(400).json({ msg: 'Cell is already available or has no vehicle' });
        }

        cell.exitDate = new Date(); // Set the current date and time
        cell.status = 'available';
        cell.plateVehicle = null;
        cell.pin = null;

        await cell.save();
        res.status(200).json(cell);
    } catch (error) {
        console.error('Error exiting vehicle:', error);
        res.status(500).json({ msg: 'Error exiting vehicle', error });
    }
};


