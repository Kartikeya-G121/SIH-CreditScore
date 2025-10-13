'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, UploadCloud, FileJson, IndianRupee } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { aiCreditScore, type AiCreditScoreOutput } from '@/ai/ai-credit-scoring';
import { billParser, type BillParserOutput } from '@/ai/flows/bill-parser';
import Image from 'next/image';


const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
  role: z.enum(['beneficiary', 'officer'], { required_error: 'Please select a role.' }),
  age: z.coerce.number().min(18, { message: 'You must be at least 18.'}).max(100),
  location: z.string().min(2, { message: 'Location is required.' }),
  occupation: z.string().min(2, { message: 'Occupation is required.' }),
  income: z.coerce.number().min(0, { message: 'Income cannot be negative.' }),
  creditHistory: z.string().min(10, { message: 'Please describe your credit history.'}),
  loanAmount: z.coerce.number().min(1000, { message: 'Loan amount must be at least 1000.' }),
});

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [scoreResult, setScoreResult] = useState<AiCreditScoreOutput | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<BillParserOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      age: 25,
      location: 'Mumbai',
      occupation: 'Small Business Owner',
      income: 50000,
      creditHistory: 'No defaults, have a credit card with 2 years of history.',
      loanAmount: 100000,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // In a real app, you would also pass the parsed bill data to the backend
    // for a more accurate credit score.
    try {
      const result = await aiCreditScore({
        personalInfo: {
            age: values.age,
            location: values.location,
            occupation: values.occupation,
        },
        financialInfo: {
            income: values.income,
            creditHistory: values.creditHistory,
            loanAmount: values.loanAmount,
        }
      });
      setScoreResult(result);
      setShowScore(true);
    } catch (error) {
       toast({
        title: 'Error Calculating Score',
        description: 'There was an issue with the AI credit scoring. Please try again.',
        variant: 'destructive',
      });
    } finally {
        setIsLoading(false);
    }
  }

  const handleDialogClose = () => {
    setShowScore(false);
    toast({
      title: 'Registration Successful',
      description: "You can now log in. We're redirecting you...",
    });
    router.push('/login');
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 4 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: 'File too large',
          description: 'Please upload an image smaller than 4MB.',
        });
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
      setParsedData(null);
      setError(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };
  
  const fileToDataUri = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleParse = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a bill image to upload.',
      });
      return;
    }

    setIsParsing(true);
    setError(null);
    setParsedData(null);
    
    try {
      const photoDataUri = await fileToDataUri(file);
      const result = await billParser({ photoDataUri });
      setParsedData(result);
      toast({
        title: 'Bill Parsed Successfully',
        description: 'The AI has extracted the information from your bill.',
      });
    } catch (e: any) {
      console.error(e);
      setError('Failed to parse the bill. The AI could not read the document. Please try a clearer image.');
      toast({
        variant: 'destructive',
        title: 'Parsing Failed',
        description: 'The AI could not read the document. Please try again.',
      });
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="m@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beneficiary">Beneficiary</SelectItem>
                    <SelectItem value="officer">Officer</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location (City)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Delhi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="occupation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occupation</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Farmer, Artisan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="income"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Income (INR)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="creditHistory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Credit History</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Paid all loans on time" {...field} />
                </FormControl>
                 <FormDescription>
                   Briefly describe your past loans or credit card usage.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={form.control}
            name="loanAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Desired Loan Amount (INR)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

        <Card>
            <CardHeader>
                <CardTitle>Upload Bills (Optional)</CardTitle>
                <CardDescription>
                    Upload utility bills to help us build a more accurate financial profile for you.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    />
                
                {!previewUrl ? (
                    <div
                    onClick={handleUploadClick}
                    className="flex flex-col items-center justify-center space-y-2 border-2 border-dashed border-muted-foreground/50 rounded-lg p-12 text-center cursor-pointer hover:border-primary transition-colors"
                    >
                    <UploadCloud className="h-12 w-12 text-muted-foreground" />
                    <p className="font-semibold">Click to upload a bill</p>
                    <p className="text-sm text-muted-foreground">PNG, JPG, or WEBP (max. 4MB)</p>
                    </div>
                ) : (
                    <div className="relative w-full max-w-sm mx-auto">
                    <Image src={previewUrl} alt="Bill preview" width={400} height={600} className="rounded-lg object-contain" />
                    </div>
                )}

                {file && !parsedData && (
                     <Button onClick={handleParse} disabled={isParsing} className="w-full">
                        {isParsing ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Parsing Bill...</>
                        ) : "Parse Bill with AI"}
                    </Button>
                )}

                {error && (
                    <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {parsedData && (
                     <div>
                        <p className="text-sm font-semibold text-center text-green-600">✓ Bill information captured.</p>
                    </div>
                )}
            </CardContent>
        </Card>


          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
             <Sparkles className="mr-2 h-4 w-4" />
            )}
            Create Account & Calculate Score
          </Button>
        </form>
      </Form>
      
      <AlertDialog open={showScore} onOpenChange={setShowScore}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Your AI Composite Credit Score</AlertDialogTitle>
            <AlertDialogDescription>
              Based on the information you provided, here is your initial credit assessment.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {scoreResult && (
            <div className="my-4 text-center">
                <div className="text-6xl font-bold text-primary">{scoreResult.creditScore}</div>
                <div className="text-lg font-semibold mt-2">{scoreResult.riskLevel} Risk</div>
                <p className="text-sm text-muted-foreground mt-4">{scoreResult.insights}</p>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleDialogClose}>Continue to Login</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

    