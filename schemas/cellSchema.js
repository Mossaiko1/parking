import mongoose from 'mongoose';

const cellSchema = new mongoose.Schema({
    cellNumber: {
        type: Number,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: ['available', 'not available'],
        default: 'available'
    },
    plateVehicle: {
        type: String,
        maxlength: 6,
        default: null
    },
    entryDate: {
        type: Date,
        default: null
    },
    exitDate: {
        type: Date,
        default: null
    },
    pin: {
        type: String,
        default: null
    }
});

export default mongoose.model('Cell', cellSchema);


