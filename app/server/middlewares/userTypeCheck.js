import User from '../models/user.model.js';

export const isRecruiter = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.userType !== 'recruiter') {
            return res.status(403).json({ message: 'Access denied. Recruiter only route.' });
        }
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Recruiter check error' });
    }
};

export const isApplicant = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.userType !== 'applicant') {
            return res.status(403).json({ message: 'Access denied. Applicant only route.' });
        }
        next();
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};