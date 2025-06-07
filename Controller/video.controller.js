import userModel from "../Model/user.model.js";
import videoModel from "../Model/video.model.js";
import channelModel from "../Model/channel.model.js";
import mongoose from "mongoose";

// Upload a new video
export async function uploadvideo(req, res) {
    const { title, thumbnailUrl, description, videoUrl } = req.body;
    const { _id } = req.user;
    try {
        const UserDetails = await userModel.findById(_id);
        if (!UserDetails.channelId) {
            throw new Error('Channel Not Created');
        }
        const newVideo = new videoModel({
            title,
            thumbnailUrl,
            videoUrl,
            userId: _id,
            description,
            channelId: UserDetails.channelId
        });
        const savedVideo = await newVideo.save();
        const channel = await channelModel.findById(UserDetails.channelId);
        channel.videos.push(savedVideo._id);
        await channel.save();
        return res.send(savedVideo);
    } catch (err) {
        return res.json({ message: err.message });
    }
}

// Fetch all videos
export async function fetchVideos(req, res) {
    try {
        const videos = await videoModel.find().sort({ uploadDate: -1 });
        return res.send(videos);
    } catch (err) {
        return res.json({ message: err.message });
    }
}

// Fetch a video by ID
export async function fetchVideoById(req, res) {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid Video ID format' });
    }
    try {
        const videoData = await videoModel.findById(id);
        if (!videoData) {
            return res.status(404).json({ message: 'Video not found' });
        }
        return res.status(200).json(videoData);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

// Increment video views
export async function addViews(req, res) {
    const { videoid } = req.params;
    try {
        const video = await videoModel.findById(videoid);
        if (!video) {
            return res.status(404).send({ error: 'Video not found' });
        }
        video.views += 1;
        await video.save();
        return res.status(200).send({ views: video.views });
    } catch (err) {
        return res.status(500).send({ error: 'An error occurred while updating the views', details: err.message });
    }
}

// Like a video
export async function addLikes(req, res) {
    const { videoid } = req.params;
    const { _id } = req.user;
    try {
        const video = await videoModel.findById(videoid);
        const user = await userModel.findById(_id);
        if (!video) {
            return res.status(404).send({ error: 'Video not found' });
        }
        const AlreadyLiked = user.likedVideos.includes(videoid);
        const AlreadyDisLiked = user.dislikedVideos.includes(videoid);
        if (AlreadyDisLiked) {
            video.dislikes -= 1;
            user.dislikedVideos = user.dislikedVideos.filter(x => x.toString() !== videoid.toString());
            await video.save();
            await user.save();
        }
        if (AlreadyLiked) {
            video.likes -= 1;
            user.likedVideos = user.likedVideos.filter(x => x.toString() !== videoid.toString());
            await video.save();
            await user.save();
            return res.status(200).send({ likes: video.likes, dislikes: video.dislikes });
        }
        video.likes += 1;
        user.likedVideos.push(videoid);
        await video.save();
        await user.save();
        return res.status(200).send({ likes: video.likes, dislikes: video.dislikes });
    } catch (err) {
        return res.status(500).send({ error: 'An error occurred while updating the likes', details: err.message });
    }
}

// Dislike a video
export async function addDislikes(req, res) {
    const { videoid } = req.params;
    const { _id } = req.user;
    try {
        const video = await videoModel.findById(videoid);
        const user = await userModel.findById(_id);
        if (!video) {
            return res.status(404).send({ error: 'Video not found' });
        }
        const AlreadyLiked = user.likedVideos.includes(videoid);
        const AlreadyDisLiked = user.dislikedVideos.includes(videoid);
        if (AlreadyLiked) {
            video.likes -= 1;
            user.likedVideos = user.likedVideos.filter(x => x.toString() !== videoid.toString());
            await video.save();
            await user.save();
        }
        if (AlreadyDisLiked) {
            video.dislikes -= 1;
            user.dislikedVideos = user.dislikedVideos.filter(x => x.toString() !== videoid.toString());
            await video.save();
            await user.save();
            return res.status(200).send({ likes: video.likes, dislikes: video.dislikes });
        }
        video.dislikes += 1;
        user.dislikedVideos.push(videoid);
        await video.save();
        await user.save();
        return res.status(200).send({ likes: video.likes, dislikes: video.dislikes });
    } catch (err) {
        return res.status(500).send({ error: 'An error occurred while updating the dislikes', details: err.message });
    }
}

// Add a comment to a video
export async function AddComment(req, res) {
    const { text, videoid } = req.body;
    const { channelId } = req.user;
    try {
        const VideoData = await videoModel.findById(videoid);
        if (!VideoData) {
            throw new Error('Video not found.');
        }
        const newComment = {
            channelId: channelId,
            text: text
        };
        VideoData.comments.unshift(newComment);
        await VideoData.save();
        return res.send(VideoData.comments);
    } catch (err) {
        return res.json({ message: err.message });
    }
}

// Delete a comment from a video
export async function DeleteComment(req, res) {
    const { commentId, videoid } = req.body;
    const { channelId } = req.user;
    try {
        const VideoData = await videoModel.findById(videoid);
        if (!VideoData) {
            throw new Error('Video not found.');
        }
        const CommentInfo = VideoData.comments.find(x => x._id.toString() === commentId);
        if (!CommentInfo || CommentInfo.channelId.toString() !== channelId.toString()) {
            throw new Error('Comment Not Found / You are Not allowed to Delete this comment.');
        }
        const filteredComment = VideoData.comments.filter(x => x._id.toString() !== commentId);
        VideoData.comments = filteredComment;
        await VideoData.save();
        return res.send(VideoData.comments);
    } catch (err) {
        return res.json({ message: err.message });
    }
}

// Edit a comment on a video
export async function EditComment(req, res) {
    const { commentId, videoid, Updatetext } = req.body;
    const { channelId } = req.user;
    try {
        const VideoData = await videoModel.findById(videoid);
        if (!VideoData) {
            throw new Error('Video not found.');
        }
        const CommentInfo = VideoData.comments.find(x => x._id.toString() === commentId);
        if (!CommentInfo || CommentInfo.channelId.toString() !== channelId.toString()) {
            throw new Error('Comment Not Found / You are Not allowed to Edit this comment.');
        }
        if (CommentInfo.text === Updatetext) {
            return res.json({ message: 'No changes required as the comment text is the same.' });
        }
        CommentInfo.text = Updatetext;
        await VideoData.save();
        return res.json({ text: Updatetext });
    } catch (err) {
        return res.json({ message: err.message });
    }
}

// Delete a video
export async function DeleteVideo(req, res) {
    const { videoid, channelid } = req.body;
    const { _id } = req.user;
    try {
        const VideoInfo = await videoModel.findById(videoid);
        const ChannelInfo = await channelModel.findById(channelid);
        if (!VideoInfo || !ChannelInfo || (ChannelInfo.userId.toString() !== _id.toString() || VideoInfo.userId.toString() !== _id.toString())) {
            throw new Error("You are not allowed to delete this video.");
        } else {
            const filteredVideos = ChannelInfo.videos.filter(x => x.toString() !== videoid.toString());
            ChannelInfo.videos = filteredVideos;
            await ChannelInfo.save();
            await videoModel.findByIdAndDelete(videoid);
            return res.json({ message: "Video deleted successfully.", videos: ChannelInfo.videos });
        }
    } catch (err) {
        return res.json({ message: err.message });
    }
}

// Edit a video
export async function EditVideo(req, res) {
    const { videoid, title, thumbnailUrl, description } = req.body;
    const { _id } = req.user;
    try {
        const VideoInfo = await videoModel.findById(videoid);
        if (!VideoInfo || VideoInfo.userId.toString() !== _id.toString()) {
            throw new Error('Video Not Found / You are not Allowed to Edit this video.');
        }
        VideoInfo.title = title;
        VideoInfo.thumbnailUrl = thumbnailUrl;
        VideoInfo.description = description;
        await VideoInfo.save();
        return res.send(VideoInfo);
    } catch (err) {
        return res.json({ message: err.message });
    }
}