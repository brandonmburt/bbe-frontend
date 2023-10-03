import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InfoIcon from '@mui/icons-material/Info';
import Tooltip from '@mui/material/Tooltip';

export function CardComp(props) {

  return (
    <Card sx={{ flexGrow: 1, minWidth: '100px', boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px', borderRadius: '5px', p: { xs: '5px', sm: '10px', lg: '20px' } }}>
        <CardContent sx={{ p: { xs: '5px', sm: '10px', lg: '20px' } }}>
            {props.title &&
                <Typography variant="h5" component="div" sx={{ marginBottom: { xs: '10px', sm: '20px' }, fontSize: { xs: '20px', md: '24px' } }}>
                    {props.title}
                    {props.tooltip &&
                        <Tooltip title={props.tooltip} placement="top" arrow>
                            <InfoIcon sx={{ marginLeft: '5px', color: 'lightgrey', lineHeight: 1, verticalAlign: 'middle' }} />
                        </Tooltip>
                    }
                </Typography>
            }

            {props.body &&
                <Typography sx={{ marginBottom: { xs: '10px', sm: '20px' } }} component={'div'} variant="body2">
                    {props.body}
                </Typography>
            }
        </CardContent>
        
        {props.button && // TODO: link to props.button.link
            <CardActions>
                <Button size="small">{props.button.text}</Button>
            </CardActions>
        }
    </Card>
  );
}