import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ZoomSchema = new Schema({
    token: {
        type: Array,
    },
    user_data: {
        type: Array,
       
    },
    user_id: {
        type: String,  
    },
    created_date: {
        type: Date,
        default: Date.now
    }
});