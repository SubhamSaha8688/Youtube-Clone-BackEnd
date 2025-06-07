import channelModel from "../Model/channel.model.js";
import userModel from '../Model/user.model.js';

// Create a new channel and associate it with the user
export async function createChannel(req, res) {
    try {
        const { channelName, description, channelProfile } = req.body;
        const { _id } = req.user;
        const ExistingChannel = await userModel.findById(_id);

        if (ExistingChannel.channelId) {
            throw new Error("Channel Already Exists");
        } else {
            const newChannel = new channelModel({
                channelName,
                userId: _id,
                description,
                channelProfile
            });
            const savedchannel = await newChannel.save();
            const updateUser = await userModel.findOneAndUpdate(
                { _id: savedchannel.userId },
                { channelId: savedchannel._id },
                { new: true }
            );
            return res.json(updateUser);
        }
    } catch (err) {
        return res.json({ error: true, message: err.message });
    }
}

// Fetch channel details by channel ID
export async function fetchChannel(req, res) {
    const channelId = req.params.id;
    try {
        const channelInfo = await channelModel.findById(channelId);
        if (!channelInfo) {
            return res.status(404).json({ message: 'Channel not found' });
        }
        return res.json(channelInfo);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// Update channel details (name, profile, banner, or description)
export async function updateChannel(req, res) {
    try {
        const { channelName, channelProfile, channelBanner, description } = req.body;
        const { _id } = req.user;
        const ExistingUser = await userModel.findById(_id);

        if (!ExistingUser.channelId) {
            throw new Error("Channel doesn't exist for this user.");
        }

        const ChannelInfo = await channelModel.findById(ExistingUser.channelId);

        if (channelName) {
            ChannelInfo.channelName = channelName;
            await ChannelInfo.save();
            return res.json({ message: "Channel name updated successfully." });
        }
        if (channelProfile) {
            ChannelInfo.channelProfile = channelProfile;
            await ChannelInfo.save();
            return res.json({ message: "Channel profile updated successfully." });
        }
        if (channelBanner) {
            ChannelInfo.channelBanner = channelBanner;
            await ChannelInfo.save();
            return res.json({ message: "Channel banner updated successfully." });
        }
        if (description) {
            ChannelInfo.description = description;
            await ChannelInfo.save();
            return res.json({ message: "Channel description updated successfully." });
        }
    } catch (err) {
        return res.json({ error: true, message: err.message });
    }
}