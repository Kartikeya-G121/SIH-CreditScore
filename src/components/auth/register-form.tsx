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
  const router = useRouter();
  const { toast } = useToast();

  const [bills, setBills] = useState<BillParserOutput[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
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
    // In a real app, this is where you would save the user and their bills
    // to a database. For this prototype, we'll just simulate it.
    
    console.log("Registering user:", values);
    console.log("With bills:", bills);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: 'Registration Successful',
      description: "You're all set! Redirecting you to the login page.",
    });

    router.push('/login');

    setIsLoading(false);
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
      setCurrentFile(selectedFile);
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
    if (!currentFile) {
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
      const photoDataUri = await fileToDataUri(currentFile);
      const result = await billParser({ photoDataUri });
      setParsedData(result);
      toast({
        title: 'Bill Parsed Successfully',
        description: 'Please review the extracted information below.',
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

  const handleConfirmBill = () => {
      if (!parsedData) return;
      setBills(prev => [...prev, parsedData]);
      handleResetUpload();
      toast({
          title: 'Bill Added',
          description: 'The bill has been added to your registration details.'
      });
  }
  
  const handleResetUpload = () => {
      setCurrentFile(null);
      setPreviewUrl(null);
      setParsedData(null);
      setError(null);
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }


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
                <CardTitle>Upload Utility Bills (Optional)</CardTitle>
                <CardDescription>
                    Upload bills like electricity, mobile, or others to help us build a more accurate financial profile for you. You can add multiple bills.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {bills.length > 0 && (
                     <div className="space-y-2">
                        <h4 className="font-medium text-sm">Added Bills:</h4>
                        <div className="flex flex-wrap gap-2">
                         {bills.map((bill, index) => (
                             <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-md text-sm">
                                <FileJson className="h-4 w-4" />
                                <span>{bill.vendorName} - <IndianRupee className="inline h-3 w-3"/>{bill.totalAmount}</span>
                             </div>
                         ))}
                        </div>
                     </div>
                 )}

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
                    <div className="space-y-4">
                        <div className="relative w-full max-w-sm mx-auto">
                            <Image src={previewUrl} alt="Bill preview" width={400} height={600} className="rounded-lg object-contain" />
                        </div>
                        
                        {currentFile && !parsedData && (
                            <Button onClick={handleParse} disabled={isParsing} className="w-full">
                                {isParsing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Parsing Bill...</>
                                ) : "Parse Bill with AI"}
                            </Button>
                        )}
                    </div>
                )}


                {error && (
                    <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {parsedData && (
                    <div className="border rounded-lg p-4 space-y-4">
                        <h3 className="font-semibold">Verify Extracted Data</h3>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <p><strong>Vendor:</strong> {parsedData.vendorName}</p>
                            <p><strong>Date:</strong> {parsedData.transactionDate}</p>
                            <p><strong>Total:</strong> <IndianRupee className="inline h-3 w-3"/>{parsedData.totalAmount}</p>
                            <p><strong>Category:</strong> {parsedData.category}</p>
                        </div>
                         <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={handleResetUpload}>Cancel</Button>
                            <Button onClick={handleConfirmBill}>Confirm & Add Bill</Button>
                        </div>
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
            Create Account
          </Button>
        </form>
      </Form>
    </>
  );
}
