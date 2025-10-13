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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { billParser, type BillParserOutput } from '@/ai/flows/bill-parser';
import Image from 'next/image';
import { useLanguage } from '@/contexts/language-context';
import { Textarea } from '../ui/textarea';

type BillCategory = BillParserOutput['category'];


const formSchema = z.discriminatedUnion('role', [
  z.object({
    role: z.literal('beneficiary'),
    name: z.string().min(1, { message: 'Name is required.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
    age: z.coerce.number().min(18, { message: 'You must be at least 18.'}).max(100),
    address: z.string().min(1, { message: 'Address is required.' }),
    location: z.string().min(2, { message: 'City/Town/Village is required.' }),
    pincode: z.string().regex(/^\d{6}$/, { message: 'Please enter a valid 6-digit Indian pincode.' }),
    occupation: z.string().min(1, { message: 'Occupation is required.' }),
    income: z.coerce.number().min(0, { message: 'Income is required and cannot be negative.' }),
    creditHistory: z.string().min(10, { message: 'Please describe your credit history.'}),
    loanAmount: z.coerce.number().min(1, { message: 'Desired loan amount is required.' }),
  }),
  z.object({
    role: z.literal('officer'),
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
  }),
  z.object({
    role: z.undefined(),
    name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Please enter a valid email.' }),
  })
]);

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useLanguage();

  const [bills, setBills] = useState<BillParserOutput[]>([]);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState<BillParserOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [billCategory, setBillCategory] = useState<BillCategory | ''>('');


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      // @ts-ignore
      age: 25,
      address: '',
      location: 'Mumbai',
      pincode: '',
      occupation: 'Small Business Owner',
      income: 50000,
      creditHistory: 'No defaults, have a credit card with 2 years of history.',
      loanAmount: 100000,
    },
  });
  
  const role = form.watch('role');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // In a real app, this is where you would save the user and their bills
    // to a database. For this prototype, we'll just simulate it.
    
    console.log("Registering user:", values);
    if (values.role === 'beneficiary') {
      console.log("With bills:", bills);
    }

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
     if (!billCategory) {
      toast({
        variant: 'destructive',
        title: 'No category selected',
        description: 'Please select a bill category.',
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
      if (!parsedData || !billCategory) return;
      const finalBillData = {
          ...parsedData,
          category: billCategory
      };
      setBills(prev => [...prev, finalBillData]);
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
      setBillCategory('');
      if (fileInputRef.current) {
          fileInputRef.current.value = "";
      }
  }


  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('general_info')}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('name_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('name_placeholder')} {...field} />
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
                    <FormLabel>{t('email_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('email_placeholder')} {...field} />
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
                    <FormLabel>{t('role_label')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('role_placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beneficiary">{t('beneficiary')}</SelectItem>
                        <SelectItem value="officer">{t('officer')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          {role === 'beneficiary' && (
            <>
              <Card>
                <CardHeader>
                    <CardTitle>{t('address_info')}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('address_label')}</FormLabel>
                            <FormControl>
                                {/* @ts-ignore */}
                                <Textarea placeholder={t('address_placeholder')} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('location_label')}</FormLabel>
                                <FormControl>
                                {/* @ts-ignore */}
                                <Input placeholder={t('location_placeholder')} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="pincode"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>{t('pincode_label')}</FormLabel>
                                <FormControl>
                                {/* @ts-ignore */}
                                <Input placeholder={t('pincode_placeholder')} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                    <CardTitle>{t('financial_info')}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('age_label')}</FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <Input type="number" {...field} />
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
                        <FormLabel>{t('occupation_label')}</FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <Input placeholder={t('occupation_placeholder')} {...field} />
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
                        <FormLabel>{t('income_label')}</FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
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
                        <FormLabel>{t('credit_history_label')}</FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <Textarea placeholder={t('credit_history_placeholder')} {...field} />
                        </FormControl>
                        <FormDescription>
                          {t('credit_history_desc')}
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
                        <FormLabel>{t('loan_amount_label')}</FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>


            <Card>
                <CardHeader>
                    <CardTitle>{t('upload_bills_title')}</CardTitle>
                    <CardDescription>
                        {t('upload_bills_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {bills.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="font-medium text-sm">{t('added_bills')}</h4>
                            <div className="flex flex-wrap gap-2">
                            {bills.map((bill, index) => (
                                <div key={index} className="flex items-center gap-2 bg-muted p-2 rounded-md text-sm">
                                    <FileJson className="h-4 w-4" />
                                    <span>{bill.category}: {bill.vendorName} - <IndianRupee className="inline h-3 w-3"/>{bill.totalAmount}</span>
                                </div>
                            ))}
                            </div>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="bill-category">{t('bill_category')}</Label>
                        <Select onValueChange={(value) => setBillCategory(value as BillCategory)} value={billCategory} disabled={!!parsedData}>
                            <SelectTrigger id="bill-category">
                                <SelectValue placeholder={t('select_bill_type')} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Electricity">Electricity</SelectItem>
                                <SelectItem value="Mobile">Mobile</SelectItem>
                                <SelectItem value="Utilities">Utilities</SelectItem>
                                <SelectItem value="Healthcare">Healthcare</SelectItem>
                                <SelectItem value="Education">Education</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>


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
                        <p className="font-semibold">{t('click_to_upload')}</p>
                        <p className="text-sm text-muted-foreground">{t('file_specs')}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative w-full max-w-sm mx-auto">
                                <Image src={previewUrl} alt="Bill preview" width={400} height={600} className="rounded-lg object-contain" />
                            </div>
                            
                            {currentFile && !parsedData && (
                                <Button onClick={handleParse} disabled={isParsing || !billCategory} className="w-full">
                                    {isParsing ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t('parsing_bill')}</>
                                    ) : t('parse_bill')}
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
                            <h3 className="font-semibold">{t('verify_parsed_data')}</h3>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <p><strong>{t('vendor')}:</strong> {parsedData.vendorName}</p>
                                <p><strong>{t('date')}:</strong> {parsedData.transactionDate}</p>
                                <p><strong>{t('total_amount')}:</strong> <IndianRupee className="inline h-3 w-3"/>{parsedData.totalAmount}</p>
                                <p><strong>{t('category')}:</strong> {billCategory} <span className="text-muted-foreground text-xs">(AI detected: {parsedData.category})</span></p>
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={handleResetUpload}>{t('re_scan')}</Button>
                                <Button onClick={handleConfirmBill}>{t('confirm_and_add')}</Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            </>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
             <Sparkles className="mr-2 h-4 w-4" />
            )}
            {t('create_account_button')}
          </Button>
        </form>
      </Form>
    </>
  );
}
