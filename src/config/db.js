import  mongoose from 'mongoose'

export const connectDB = async () => {
    const MONGODB = 'mongodb+srv://Library:Olarewaju1@cluster0.mtbdfov.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
    await mongoose.connect(MONGODB).then(() => {
      console.log('Conneccted to Database')
    })
}