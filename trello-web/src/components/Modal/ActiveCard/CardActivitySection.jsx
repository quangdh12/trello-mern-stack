import { Avatar, Box, TextField, Tooltip, Typography } from '@mui/material';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/redux/user/userSlice';

const CardActivitySection = ({cardComments = [], onAddCardComment}) => {
    const currentUser = useSelector(selectCurrentUser);

    const handleAddComment = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!e.target?.value) return;

            const commentToAdd = {
                userAvatar: currentUser?.avatar,
                userDisplayName: currentUser?.displayName,
                content: e.target.value.trim(),
            };

            onAddCardComment(commentToAdd).then(() => {
                e.target.value = ''
            })
        }
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Avatar
                    sx={{ width: 36, height: 36, cursor: 'pointer' }}
                    alt="avatar-img"
                    src={currentUser?.avatar}
                />
                <TextField
                    fullWidth
                    placeholder="Write a comment..."
                    type="text"
                    variant="outlined"
                    multiline
                    onKeyDown={handleAddComment}
                />
            </Box>
            {cardComments.length === 0 && (
                <Typography
                    sx={{ pl: '45px', fontSize: '14px', fontWeight: 500, color: '#b1b1b1' }}
                >
                    No activity found!
                </Typography>
            )}

            {cardComments.map((comment, index) => (
                <Box sx={{ display: 'flex', gap: 1, width: '100%', mb: 1.5 }} key={index}>
                    <Tooltip title="">
                        <Avatar
                            sx={{ width: 36, height: 36, cursor: 'pointer' }}
                            alt="avatar-img"
                            src={comment?.userAvatar}
                        />
                    </Tooltip>
                    <Box sx={{ width: 'inherit' }}>
                        <Typography variant="span" sx={{ fontWeight: 'bold', mr: 1 }}>
                           {comment?.userDisplayName}
                        </Typography>

                        <Typography variant="span" sx={{ fontSize: '12px' }}>
                            {moment(comment?.commentedAt).format('llll')}
                        </Typography>

                        <Box
                            sx={{
                                display: 'block',
                                bgcolor: (theme) =>
                                    theme.palette.mode === 'dark' ? '#33485d' : 'white',
                                p: '8px 12px',
                                mt: '4px',
                                border: '0.5px solid rgba(0, 0, 0, 0.2)',
                                borderRadius: '4px',
                                wordBreak: 'break-word',
                                boxShadow: '0 0 1px rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            {comment?.content}
                        </Box>
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default CardActivitySection;
