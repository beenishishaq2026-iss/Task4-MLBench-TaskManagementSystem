const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: '',
        },

        priority: {
            type: String,
            enum: {
                values: ['Low', 'Medium', 'High'],
                message: 'Priority must be Low, Medium, or High',
            },
            default: 'Medium',
        },

        status: {
            type: String,
            enum: {
                values: ['Pending', 'In Progress', 'Completed'],
                message: 'Status must be Pending, In Progress, or Completed',
            },
            default: 'Pending',
        },

        dueDate: {
            type: Date,
            required: [true, 'Due date is required'],
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

        deletedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true }
);

taskSchema.pre(/^find/, function () {
    this.where({ isDeleted: false });
});

module.exports = mongoose.model('Task', taskSchema);