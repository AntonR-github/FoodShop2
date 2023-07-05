import { connect, ConnectOptions } from 'mongoose';

export const connectDB = async () => {
    connect(process.env.MONGO_URI!, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    } as ConnectOptions).then(() => {
        console.log('Connected to database');
    }
    ).catch((err) => {
        console.log('Failed to connect to database');
        console.log(err);
    }
    );
}