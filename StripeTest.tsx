import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStripeCheckout } from "@/hooks/use-stripe-checkout";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";

export default function StripeTest() {
  const { startCheckout, loading, error } = useStripeCheckout();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testIndividualPlan = async () => {
    addTestResult("Testing Individual Plan checkout...");
    try {
      await startCheckout("individual", true);
      addTestResult("✅ Individual Plan test completed");
    } catch (err) {
      addTestResult(`❌ Individual Plan test failed: ${err}`);
    }
  };

  const testClinicPlan = async () => {
    addTestResult("Testing Clinic Plan checkout...");
    try {
      await startCheckout("clinic", true);
      addTestResult("✅ Clinic Plan test completed");
    } catch (err) {
      addTestResult(`❌ Clinic Plan test failed: ${err}`);
    }
  };

  const testApiDirectly = async () => {
    addTestResult("Testing API endpoint directly...");
    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: "price_1RmsdpRp9WfR1T0dKVFhyml1",
          plan: "individual",
          successUrl: window.location.origin + "/success",
          cancelUrl: window.location.origin + "/pricing",
        }),
      });

      const data = await response.json();
      addTestResult(`✅ API test completed: ${JSON.stringify(data)}`);
    } catch (err) {
      addTestResult(`❌ API test failed: ${err}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Info className="w-6 h-6 text-blue-600" />
              <span>Stripe Integration Test Page</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="font-semibold mb-2">Environment Status:</h3>
                <Badge variant="secondary">
                  Demo Mode Active (Add real Stripe keys to enable)
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Price IDs:</h3>
                <div className="text-sm space-y-1">
                  <div>Individual: price_1RmsdpRp9WfR1T0dKVFhyml1</div>
                  <div>Clinic: price_1RmseBRp9WfR1T0dufgzjZM0</div>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="font-medium text-red-800">Error:</span>
                </div>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="font-semibold">Test Checkout Functions:</h3>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={testIndividualPlan}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Test Individual Plan
                </Button>

                <Button
                  onClick={testClinicPlan}
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Test Clinic Plan
                </Button>

                <Button
                  onClick={testApiDirectly}
                  disabled={loading}
                  variant="outline"
                >
                  Test API Directly
                </Button>

                <Button onClick={() => setTestResults([])} variant="outline">
                  Clear Results
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <div className="text-gray-500">
                  Click a test button to see results...
                </div>
              ) : (
                testResults.map((result, index) => (
                  <div key={index} className="mb-1">
                    {result}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Badge variant="outline" className="text-sm">
            <CheckCircle className="w-4 h-4 mr-2" />
            Debug page - Remove before production
          </Badge>
        </div>
      </div>
    </div>
  );
}
